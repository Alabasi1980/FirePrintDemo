import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

import { curriculum } from './lib/curriculum';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const getRandomDuelText = () => {
  try {
    const suitableLessons = curriculum.filter(l => 
      (l.type === 'test' || l.type === 'exercise') && 
      l.contentVariations[1].length > 50 &&
      l.contentVariations[1].length < 250
    );
    if (suitableLessons.length > 0) {
      const randomLesson = suitableLessons[Math.floor(Math.random() * suitableLessons.length)];
      return randomLesson.contentVariations[1];
    }
  } catch (e) {
    console.error("Error picking random text:", e);
  }
  return "The quick brown fox jumps over the lazy dog. Mastery of typing requires patience and consistent practice every single day.";
};

app.prepare().then(() => {
  const httpServer = createServer();

  const io = new Server(httpServer, {
    path: "/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ["polling", "websocket"],
    allowEIO3: true
  });

  httpServer.on('request', (req, res) => {
    const parsedUrl = parse(req.url!, true);
    const { pathname } = parsedUrl;

    if (pathname?.startsWith('/socket.io')) return;

    handle(req, res, parsedUrl);
  });

  // In-memory duel rooms state
  const duelRooms = new Map<string, { 
    players: { id: string, socketId: string }[], 
    status: 'waiting' | 'starting' | 'racing' | 'finished', 
    text: string, 
    betAmount: number 
  }>();

  io.on('connection', (socket) => {
    console.log('User connected to Duel Server:', socket.id);
    
    socket.on('join-duel', ({ duelId, betAmount }) => {
      console.log(`Join request from ${socket.id} for duel ${duelId}`);
      if (!duelId) return;
      
      const normalizedDuelId = duelId.trim().toUpperCase();
      socket.join(normalizedDuelId);
      
      if (!duelRooms.has(normalizedDuelId)) {
        console.log(`Creating new duel room: ${normalizedDuelId} by ${socket.id}`);
        const room = { 
          players: [{ id: socket.id, socketId: socket.id }], 
          status: 'waiting' as const,
          text: getRandomDuelText(),
          betAmount: betAmount || 50
        };
        duelRooms.set(normalizedDuelId, room);
        
        // Send room info back to the creator immediately
        socket.emit('duel-ready', { 
          text: room.text,
          betAmount: room.betAmount,
          players: [socket.id],
          isCreator: true
        });
      } else {
        const room = duelRooms.get(normalizedDuelId)!;
        
        // Check if player is already in room
        const existingPlayerIndex = room.players.findIndex(p => p.socketId === socket.id);
        
        if (existingPlayerIndex === -1 && room.players.length < 2) {
          console.log(`Player ${socket.id} joining existing duel room: ${normalizedDuelId}`);
          room.players.push({ id: socket.id, socketId: socket.id });
          
          if (room.players.length === 2) {
            room.status = 'starting';
            console.log(`Duel ${normalizedDuelId} is ready with players:`, room.players.map(p => p.id));
            
            // Emit to both players
            io.in(normalizedDuelId).emit('duel-ready', { 
              text: room.text,
              betAmount: room.betAmount,
              players: room.players.map(p => p.id)
            });
            
            // Start countdown
            setTimeout(() => {
              if (duelRooms.has(normalizedDuelId)) {
                room.status = 'racing';
                console.log(`Duel ${normalizedDuelId} starting!`);
                io.in(normalizedDuelId).emit('duel-start');
              }
            }, 3000);
          }
        } else {
          console.log(`Join rejected for ${socket.id} in ${normalizedDuelId}. Room full or already in.`);
        }
      }
    });

    socket.on('typing-update', ({ duelId, wpm, accuracy, progress }) => {
      if (!duelId) return;
      const normalizedDuelId = duelId.trim().toUpperCase();
      socket.to(normalizedDuelId).emit('opponent-update', { 
        playerId: socket.id,
        wpm, 
        accuracy, 
        progress 
      });
    });

    socket.on('duel-complete', ({ duelId }) => {
      if (!duelId) return;
      const normalizedDuelId = duelId.trim().toUpperCase();
      const room = duelRooms.get(normalizedDuelId);
      
      if (room && room.status !== 'finished') {
        room.status = 'finished';
        console.log(`Duel ${normalizedDuelId} completed. Winner: ${socket.id}`);
        io.to(normalizedDuelId).emit('duel-result', { 
          winnerId: socket.id, 
          betAmount: room.betAmount 
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Clean up rooms where this player was present
      for (const [duelId, room] of duelRooms.entries()) {
        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIndex !== -1) {
          if (room.status === 'waiting') {
            // If still waiting, just remove the player or the room
            room.players.splice(playerIndex, 1);
            if (room.players.length === 0) {
              duelRooms.delete(duelId);
            }
          } else if (room.status !== 'finished') {
            // If in progress, notify the other player
            socket.to(duelId).emit('opponent-disconnected');
            // We keep the room for a bit or delete it
            duelRooms.delete(duelId);
          }
        }
      }
    });
  });

  httpServer.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
