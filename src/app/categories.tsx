import { BrushSharp, BusinessCenterSharp, CoffeeSharp, DevicesSharp, DirectionsCarSharp, ExploreSharp, FavoriteSharp, GavelSharp, HandymanSharp, MovieSharp, PeopleSharp, PetsSharp, RamenDiningSharp, SchoolSharp, ScienceSharp, SportsVolleyballSharp, SurfingSharp, VideogameAssetSharp, WorkSharp } from "@mui/icons-material";

export interface PostCategory {
    id: number,
    name: string,
    displayName: string,
    icon: React.ReactNode,
};

export interface PostCategoryPlain {
    id: number,
    name: string,
    displayName: string
}

const newCategory = (id: number, displayName: string, name: string, icon: React.ReactNode): PostCategory => {
    return {
        id,
        name,
        displayName, 
        icon
    };
}

export const HomeCategory = {
    id: 19,
    name: "home",
    displayName: "Home",
}

export const postCategories = [
    newCategory(0, "Technology", "technology", <DevicesSharp />),
    newCategory(1, "Gaming", "gaming", <VideogameAssetSharp />),
    newCategory(2, "Entertainment", "entertainment", <MovieSharp />),
    newCategory(3, "Lifestyle", "lifestyle", <CoffeeSharp />),
    newCategory(4, "Education", "education", <SchoolSharp />),
    newCategory(5, "Community", "commmunity", <PeopleSharp />),
    newCategory(6, "Business", "business", <BusinessCenterSharp />),
    newCategory(7, "Hobbies", "hobbies", <SurfingSharp />),
    newCategory(8, "Science", "science", <ScienceSharp />),
    newCategory(9, "Sports", "sports", <SportsVolleyballSharp />),
    newCategory(10, "Creative Arts", "creative_arts", <BrushSharp />),
    newCategory(11, "Politics", "politics", <GavelSharp />),
    newCategory(12, "DIY & Crafting", "diy_crafting", <HandymanSharp />),
    newCategory(13, "Automobiles", "automobiles", <DirectionsCarSharp />),
    newCategory(14, "Pets & Animals", "pets_animals", <PetsSharp />),
    newCategory(15, "Health & Wellness", "health_wellness", <FavoriteSharp />),
    newCategory(16, "Work & Productivity", "work_productivity", <WorkSharp />),
    newCategory(17, "Travel", "travel", <ExploreSharp />),
    newCategory(18, "Food & Drinks", "food_drinks", <RamenDiningSharp />),
].sort((a, b) => a.name < b.name ? -1 : 1);

export const postCategoriesDict = postCategories.reduce((acc: {[id: number]: PostCategory}, category: PostCategory) => {
  acc[category.id] = category;
  return acc;
}, {});