
// Using in-memory storage instead of MongoDB for better performance
// As per development guidelines, prefer in-memory storage unless specifically asked for database

export const connectDB = async () => {
  console.log('Using in-memory storage - no database connection needed');
  return Promise.resolve();
};
