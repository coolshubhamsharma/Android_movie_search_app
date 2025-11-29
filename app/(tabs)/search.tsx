import MovieCards from '@/components/MovieCards'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from '@/services/api'
import { updateSearchCount } from '@/services/appwrite'
import useFetch from '@/services/useFetch'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'

const search = () => {

  const [searchQuery, setSearchQuery] = useState('');

  const {
    data:movies, 
    loading, 
    error,
    refetch:loadMovies,
    reset,
  } = useFetch(() => fetchMovies({
    query:searchQuery
  }),false) //calling the useFetchHook-->fetchMovies function -->fetch request, passing false so that auto-fetch has false value and we pass searchQuery here so that when search , only then the data is fetched

  useEffect(()=>{  //whenever the searchquery changes fetches movies , so it is happening with every letter you type in the search bar , so we use setTimeout i.e. how long it will wait for next key stroke to fetch i.e.if the time between two key strokes is less than 500ms then it will not send fetch request , but is the time between two key strokes is more than it would send the fetch request.

    const timeoutId = setTimeout(async()=>{
      if(searchQuery.trim()){
        await loadMovies();

      }else{
        reset();
      }
    },500)

    return ()=> clearTimeout(timeoutId); //clearing all the timeouts for erriciency of the programs

  },[searchQuery])

  useEffect(()=>{
    if(movies?.length > 0 && movies?.[0]){
          updateSearchCount(searchQuery, movies[0])
          //updating the database for user search, to know which movies are searched the most and are trending
        }
  },[movies])

  return (
    <View className='flex-1 bg-primary'> 
       <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover'/>
       
       <FlatList 
        data={movies}
        renderItem={({item})=>(
          <MovieCards {...item} />
        )}
        keyExtractor={(item)=>item.id.toString()}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent:'center',
          gap:16,
          marginVertical:16
        }}
        contentContainerStyle={{
          paddingBottom:100
        }}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-20 items-center'>
              <Image source={icons.logo} className='w-12 h-10'/>
            </View>

            <View className='my-5'>
              <SearchBar 
                placeholder='Search movies...'
                value={searchQuery}
                onChangeText={(text:string) => setSearchQuery(text)}
              />
            </View>

            {loading && (<ActivityIndicator size='large' color="#0000ff" className="my-3" />)}

            {error && (<Text className='text-red-500 px-5 my-3'>
              Error: {error.message}
            </Text>)}

            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text className='text-xl text-white font-bold'>
                Search Results for {' '}
                <Text className='text-accent '>{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className='mt-20 px-5'>
              <Text className='text-xl text-center text-gray-400'>{searchQuery.trim()? 'No Movies Found' : 'Search for a movie'}</Text>
            </View>
          ):null
        }
       />
    </View>
  )
}

export default search