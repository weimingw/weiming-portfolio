const stateOnLoad = { ...localStorage };

export const stateFields = {
    SESSION: 'session',
    USER: 'user',
    HEXAGRID_VOLUME: 'hexagridVolume',
    NOTIFICATION_MESSAGES: 'notificationMessages',
}

export default {
    [stateFields.SESSION]: null,
    [stateFields.USER]: null,
    [stateFields.HEXAGRID_VOLUME]: 0.75,
    [stateFields.NOTIFICATION_MESSAGES]: [],
};