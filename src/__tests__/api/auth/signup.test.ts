import { POST } from '@/app/api/auth/signup/route';
import { NextRequest } from 'next/server';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    workspace: {
      create: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('/api/auth/signup', () => {
  it('should create a new user successfully', async () => {
    const { prisma } = require('@/lib/prisma');
    
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user_123',
      name: 'Test User',
      email: 'test@example.com',
    });
    prisma.workspace.create.mockResolvedValue({
      id: 'workspace_123',
      name: "Test User's Workspace",
    });

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.user).toBeDefined();
    expect(data.workspace).toBeDefined();
  });

  it('should reject duplicate email', async () => {
    const { prisma } = require('@/lib/prisma');
    
    prisma.user.findUnique.mockResolvedValue({
      id: 'existing_user',
      email: 'test@example.com',
    });

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('User already exists');
  });

  it('should validate password length', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'short',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toContain('Password must be at least 8 characters');
  });
});