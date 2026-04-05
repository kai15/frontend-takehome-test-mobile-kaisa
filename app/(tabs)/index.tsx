import CourseCard from '@/components/CourseCard';
import EmptyData from '@/components/EmptyData';
import Filter from '@/components/Filter';
import Loading from '@/components/Loading';
import dataDefault from '@/data/data.json';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Courses {
    id: number;
    title: string;
    description: string;
    content: string;
    category: string;
    duration: string;
    level: string;
    author: string;
    image: string;
    rating: number;
    createdAt: string;
}

interface Pagination {
    total_data: number;
    current_page: number;
    limit: number;
    total_pages: number;
}

export default function CourseScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [page, setPage] = useState(1);
    const limit = 10;
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [data, setData] = useState<Courses[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total_data: 1,
        current_page: 1,
        limit: 10,
        total_pages: 1
    });
    const [loading, setLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    const fetchData = async (currentPage: number) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/courses?page=${currentPage ?? 1}&limit=${limit}&category=${category === 'All' ? '' : category}&search=${search}`);
            const result = await response.json();

            if (result?.data?.length > 0) {
                setData(currentPage === 1 ? result?.data : [...data, ...result.data]);
                setPagination(result?.meta);
            } else {
                setData([]);
                setPagination({
                    total_data: 0,
                    current_page: 1,
                    limit: 10,
                    total_pages: 0
                })
            }
        } catch (error) {
            console.error("Gagal ambil data:", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setPage(1);
            fetchData(1);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search, category]);

    const onRefresh = () => {
        setData([]);
        setIsRefreshing(true);
        setPage(1);
        fetchData(1);
    };

    const handleLoadMore = () => {
        if (pagination.total_pages > page) {
            if (!loading) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchData(nextPage);
            }
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Courses</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.colors.outline }]}>
                        {pagination.total_data} total data
                    </Text>
                </View>
            </View>
            <Filter
                data={dataDefault.categories ?? []}
                category={category}
                setCategory={setCategory}
                search={search}
                setSearch={setSearch}
            />
            <FlatList
                data={data}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <CourseCard course={item} />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={['#5856D6']}
                        tintColor="#5856D6"
                    />
                }
                onEndReached={handleLoadMore}
                ListFooterComponent={loading ? <Loading /> : null}
                ListEmptyComponent={() => {
                    return (
                        !loading && <EmptyData />
                    )
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    logo: {
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
        paddingBottom: 100
    }
});
