import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Searchbar, useTheme } from "react-native-paper";

interface FilterProps {
    data: any;
    category: any;
    setCategory: any;
    search: any;
    setSearch: any;
}
export default function Filter({ data, category, setCategory, search, setSearch }: FilterProps) {
    const theme = useTheme();
    const listCategory = data ?? [];
    return (
        <View style={styles.header}>
            <Searchbar
                placeholder='Search courses...'
                onChangeText={setSearch}
                value={search}
                style={[styles.search, { backgroundColor: theme.colors.background, borderColor: theme.colors.outline}]}
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
                        style={[styles.chip, {backgroundColor: theme.colors.inverseOnSurface}]}
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
        borderWidth: 1
    },
    header: {
        padding: 20,
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