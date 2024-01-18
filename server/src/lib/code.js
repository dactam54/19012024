export const getCode = () => {
    return `#${Math.floor(Math.random() * (999999999999999))}`;
}

console.log(getCode());