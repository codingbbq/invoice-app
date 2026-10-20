// Server-side authentication helper
// Note: This provides basic validation but Firestore rules are still public
// For production, use Firebase Authentication instead of custom auth

export interface User {
  id: string;
  username: string;
  email?: string;
}

/**
 * Validates user session from request headers
 * In a production app, this should validate a secure session token
 * For now, this is a placeholder that documents the security limitation
 */
export async function validateUserSession(request: Request): Promise<User | null> {
  try {
    // Get user data from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const userData = JSON.parse(authHeader.substring(7));
    
    // Basic validation - in production, validate against a secure session store
    if (userData && userData.id && userData.username) {
      return userData;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to require authentication for API routes
 * Note: This is basic validation. Firestore rules are still public.
 * For production security, implement Firebase Authentication.
 */
export function requireAuth(handler: (user: User, request: Request) => Promise<Response>) {
  return async (request: Request) => {
    const user = await validateUserSession(request);
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    return handler(user, request);
  };
}
