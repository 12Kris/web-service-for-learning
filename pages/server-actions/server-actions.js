'use server';

export async function handleLogin({ username, password }) {
  const mockUsers = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
  ];

  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    return { success: true, message: 'Login successful', user };
  } else {
    return { success: false, message: 'Invalid username or password.' };
  }
}
