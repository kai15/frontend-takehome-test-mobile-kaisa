import CourseCard from '@/components/CourseCard';
import EmptyData from '@/components/EmptyData';
import Filter from '@/components/Filter';
import data from '@/data/data.json';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function CourseScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');


  const filterData = useMemo(() => {
    return data.courses.filter((value) => {
      const isExist = value.title.toLowerCase().includes(search.toLowerCase());
      const isExistCategory = category === 'All' || value.category === category;
      return isExist && isExistCategory;
    })
  }, [search, category, data.courses])

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Filter
        data={data.categories ?? []}
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
      />

      <FlatList
        data={filterData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseCard course={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return (
            <EmptyData />
          )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5F5F5',
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  logo: {
    // color: 'F5F5F5',
    fontWeight: '900',
    marginBottom: 15
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  list: {
    paddingBottom: 20
  },
});
