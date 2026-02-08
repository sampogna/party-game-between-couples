// Setup file for Jest tests
import { roomService } from '../services/RoomService';
import { playerService } from '../services/PlayerService';

// Clean up before all tests
beforeAll(() => {
  // Clear all rooms and players
  roomService.clearAllRooms();
});

// Clean up after each test
afterEach(() => {
  roomService.clearAllRooms();
});

// Clean up after all tests
afterAll(() => {
  roomService.clearAllRooms();
});
