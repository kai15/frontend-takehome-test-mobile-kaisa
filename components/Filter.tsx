import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Searchbar } from "react-native-paper";

interface FilterProps {
    data: any;
    category: any;
    setCategory: any;
    search: any;
    setSearch: any;
}
export default function Filter({ data, category, setCategory, search, setSearch }: FilterProps) {
    const listCategory = data ?? [];
    return (
        <View style={styles.header}>
            {/* <Text variant='headlineSmall' style={styles.logo}>Frontend Test</Text> */}
            <Searchbar
                placeholder='Search courses...'
                onChangeText={setSearch}
                value={search}
                style={styles.search}
            />

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
                contentContainerStyle={styles.categoryContent}
            >
                {["All", ...listCategory].map((val) => (
                    <Chip
                        key={val}
                        selected={category === val}
                        onPress={() => setCategory(val)}
                        style={styles.chip}
                        showSelectedCheck={true}
                    >
                        {val}
                    </Chip>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    search: {
        borderRadius: 12,
        // backgroundColor: '#F0F0F0'
    },
    header: {
        padding: 20,
        // paddingTop: 60,
        // backgroundColor: '#FFFFFF'
    },
    categoryContainer: {
        marginTop: 15,
        marginBottom: 5,
    },
    categoryContent: {
        paddingHorizontal: 5,
        gap: 8,
    },
    chip: {
        borderRadius: 20,
    },
})