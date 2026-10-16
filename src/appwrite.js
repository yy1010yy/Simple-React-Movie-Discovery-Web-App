import { Client, TablesDB, ID, Query } from "appwrite"

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const tableId = import.meta.env.VITE_APPWRITE_TABLE_ID;
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client().setEndpoint(endpoint).setProject(projectId);

const database = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
    // 1. Use appropriate appwrite SDK to check if searchTerm exists in the database
    try {
        const result = await database.listRows({
            databaseId, 
            tableId, 
            queries: [Query.equal('searchTerm', searchTerm)], 
        });

        // 2. if it does, update the count
        if (result.rows.length > 0) {
            const row = result.rows[0];

            await database.updateRow({
                databaseId, 
                tableId, 
                rowId: row.$id, 
                data: {
                    count: row.count + 1, 
                },
            });
        }
        // 3. if it doesnt, create new row with seachTerm and acount as 1
        else {
            await database.createRow({
                databaseId,
                tableId,
                rowId: ID.unique(),
                data: {
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "",
                },
            });
        }
    } catch (error) {
        console.error(`Error updating database searches: ${error}`);
    }
    
}