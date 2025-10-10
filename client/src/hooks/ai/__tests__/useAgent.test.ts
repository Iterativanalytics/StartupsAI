import { renderHook, act } from '@testing-library/react';
import { useAgent } from '../useAgent';
import { useAuth } from '../../use-auth';

// Mock the useAuth hook
jest.mock('../../use-auth', () => ({
  useAuth: jest.fn()
}));

// Mock the streaming utils
jest.mock('@/utils/streamingUtils', () => ({
  processStreamingResponse: jest.fn(),
  getOrCreateSessionId: jest.fn(() => 'test-session-id'),
  handleAgentError: jest.fn((error) => error.message)
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('useAgent', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    userType: 'entrepreneur' as const
  };

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: jest.fn(),
      logout: jest.fn(),
      isLoading: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should return null when user is not authenticated', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        isLoading: false
      });

      const { result } = renderHook(() => useAgent());

      let response: any;
      await act(async () => {
        response = await result.current.sendMessage('test message');
      });

      expect(response).toBeNull();
      expect(result.current.error).toBe('User not authenticated');
    });

    it('should send a message successfully', async () => {
      const mockResponse = {
        id: 'response-123',
        content: 'Test response',
        agentType: 'advisor',
        timestamp: new Date(),
        suggestions: ['suggestion1', 'suggestion2']
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const { result } = renderHook(() => useAgent());

      let response: any;
      await act(async () => {
        response = await result.current.sendMessage('test message');
      });

      expect(response).toEqual({
        ...mockResponse,
        timestamp: expect.any(Date)
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle streaming requests', async () => {
      const { processStreamingResponse } = require('@/utils/streamingUtils');
      const mockStreamResponse = {
        id: 'response-123',
        content: 'Streaming response',
        agentType: 'advisor',
        timestamp: new Date()
      };

      processStreamingResponse.mockResolvedValue(mockStreamResponse);

      const { result } = renderHook(() => useAgent());

      let response: any;
      await act(async () => {
        response = await result.current.sendMessage('test message', {
          streaming: true,
          onChunk: jest.fn()
        });
      });

      expect(processStreamingResponse).toHaveBeenCalled();
      expect(response).toEqual(mockStreamResponse);
    });

    it('should handle errors gracefully', async () => {
      const mockError = new Error('Network error');
      global.fetch = jest.fn().mockRejectedValue(mockError);

      const { result } = renderHook(() => useAgent());

      let response: any;
      await act(async () => {
        response = await result.current.sendMessage('test message');
      });

      expect(response).toBeNull();
      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loading state', () => {
    it('should set loading to true during request', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      global.fetch = jest.fn().mockReturnValue(promise);

      const { result } = renderHook(() => useAgent());

      act(() => {
        result.current.sendMessage('test message');
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise({
          ok: true,
          json: () => Promise.resolve({})
        });
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
