import { dailyRecommendations } from '../../../../common/app/nutrition/nutritionCommon';
import { nutrientIds } from '../nutritionUiCommon';

const metadata = [ ...dailyRecommendations.entries() ]
    .map(([ nutrientId, metadata ]) => ({
        nutrientId,
        type: metadata.type,
        label: metadata.label,
    }));

export const MACRONUTRIENTS = metadata.filter(nutrient => nutrient.type === 'w');
export const HELPFUL = metadata.filter(nutrient => nutrient.type === 'x');
export const VITAMINS = metadata.filter(nutrient => nutrient.type === 'y');
export const OTHER = metadata.filter(nutrient => nutrient.type === 'z');
export const BLANK_NUTRIENT_MAP = Object.freeze(nutrientIds.reduce((acc, nutrientId) => {
    acc[nutrientId] = 0;
    return acc;
}, { }));
