import { dailyRecommendations } from '../../../common/app/nutrition/nutritionCommon';
import { roundNumber } from '../../helpers/numberUtil';

export const PERCENTAGE = '%';

export const nutrientIds = [ ...dailyRecommendations.keys() ];

/**
 * Takes in a nutrient list item in customEntry and returns the amount in the unit of the nutrient in dailyRecommendation
 * @param {*} customEntryItem has unit, nutrientId (as 'key'), and amount
 */
export function getNutrientAmountFromCustomEntryItem(customEntryItem) {
    if (customEntryItem.unit === PERCENTAGE) {
        return getNutrientAmountFromPercentage(customEntryItem.key, customEntryItem.amount);
    } else {
        return customEntryItem.amount;
    }
}

/**
 * Takes in a percentage and returns an equivalent amount in the unit of the nutrient in dailyRecommendation
 * Example: taking in percentage = 100 for Vitamin K returns 120, for 120 micrograms
 */
export function getNutrientAmountFromPercentage(nutrientId, percentage) {
    return dailyRecommendations.get(nutrientId).amount * percentage / 100;
}

/**
 * Exact opposite of getNutrientAmountFromPercentage
 */
export function getNutrientPercentageFromAmount(nutrientId, amount) {
    return amount / dailyRecommendations.get(parseInt(nutrientId)).amount * 100;
}