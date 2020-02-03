export const DARK = '#383838';
export const LIGHT = '#BBBBBB';
export const GREEN = '#98C379';
export const RED = '#E06455';
export const ORANGE = '#D19A66';
export const YELLOW = '#DAB570';
export const BLUE = '#61AFEF';
export const PURPLE = '#9A7FD5';

export const DARKER = '#2b2b2b';

export function hexToRgb(hex, alpha=1) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` :
        'rgba(0, 0, 0, 1)';
  }
function hexToRgbA(hex){
    
}

hexToRgbA('#fbafff')