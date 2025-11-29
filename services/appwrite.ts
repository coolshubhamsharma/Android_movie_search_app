// track the searches made by the user
import { Client, Databases, ID, Query } from "react-native-appwrite";

//establishing connection with the databse
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)


// setting up database instance    
const database = new Databases(client);

export const updateSearchCount = async (query:string, movie:Movie) => {

    //we have to call the appwrite api to browse the database and check if a document already exists for the given searchTerm
    //check if the record of that search has already been stored
    //if a docuemnt is found simply increment a searchCount field
    //if no document is found create a new document in Appwrite database -> 1

    try{
            const results = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query)
        ])

        if(results.documents.length > 0){
            const existingMovie  = results.documents[0]

            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1
                }
                )
        }else{
            await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                title:movie.title,
                poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    }
    catch(error){
        console.log(error);
        throw error;
    }
    
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> =>{
    try{

        const results = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count')
        ])

        return results.documents as unknown as TrendingMovie[];
        //Appwrite returns something like:
        // {
        //     total: number,
        //     documents: [
        //         { $id: "...", count: 10, movie_id: 123, poster_url: "...", ... }
        //     ]
        // }
        //documents is typed as Document[], not TrendingMovie[].
        //as unknown removes Appwrite’s type information.
        //Now you can safely tell TypeScript: as TrendingMovie[]
        //It literally means:
        //“Trust me TypeScript, I know this is TrendingMovie[].”

            
    }catch(error){
        console.log(error); 
        return undefined;
    }
}