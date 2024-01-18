import icons from "./icons"


const { AiFillStar } = icons
export const renderStar = (number) => {
    if (number > 5) number = 5
    const stars = []
    for (let i = 0; i < number; i++) stars.push(<AiFillStar size={16} color='#f59e0b' />)
    for (let i = number; i < 5; i++) stars.push(<AiFillStar size={16} />)

    return stars
}

export const formatVietnameseToString = (keyword) => {
    return keyword
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(" ")
        .join("-")
}

export const formatNumber = (number) => {
    const letter = number >= Math.pow(10, 9) ? 'B' : number >= Math.pow(10, 6) ? 'M' : 'K'
    const n = number < Math.pow(10, 3) ? 1 : number < Math.pow(10, 6) ? 1000 : 1000000
    if (number < 1000) return number
    return `${Math.round(number / n)}${letter}`
}
export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export function getDaysInMonth(customTime, number) {
    const endDay = new Date(customTime)?.getDate() || new Date().getDate()
    const days = number || 15
    const endPreviousMonth = new Date(new Date(customTime)?.getFullYear(), new Date(customTime)?.getMonth(), 0).getDate()
    let day = 1
    let prevDayStart = 1
    const daysInMonths = []
    while (prevDayStart <= +endPreviousMonth) {
        const month = new Date().getMonth()
        const year = new Date().getFullYear() % 1000
        daysInMonths.push(`${prevDayStart < 10 ? '0' + prevDayStart : prevDayStart}-${month < 10 ? `0${month}` : month}-${year}`)
        prevDayStart += 1
    }
    while (day <= +endDay) {
        const month = new Date().getMonth() + 1
        const year = new Date().getFullYear() % 1000
        daysInMonths.push(`${day < 10 ? '0' + day : day}-${month < 10 ? `0${month}` : month}-${year}`)
        day += 1
    }
    return daysInMonths.filter((el, index, self) => index > self.length - days - 2)
}
export function getMonthInYear(customTime, number) {
    const endMonth = new Date(customTime?.to).getMonth() + 1 || new Date().getMonth() + 1
    let month = 1
    const months = number || 8
    let startLastYear = 1
    const daysInMonths = []
    while (startLastYear <= 12) {
        const year = new Date().getFullYear() % 1000
        daysInMonths.push(`${startLastYear < 10 ? `0${startLastYear}` : startLastYear}-${year - 1}`)
        startLastYear += 1
    }
    while (month <= +endMonth) {
        const year = new Date().getFullYear() % 1000
        daysInMonths.push(`${month < 10 ? `0${month}` : month}-${year}`)
        month += 1
    }
    return daysInMonths.filter((el, index, self) => index > self.length - months - 2)
}
export const getDaysInRange = (start, end) => {
    const startDateTime = new Date(start).getTime()
    const endDateTime = new Date(end).getTime()
    return (endDateTime - startDateTime) / (24 * 60 * 60 * 1000)
}
export const getMonthsInRange = (start, end) => {
    let months;
    const d1 = new Date(start)
    const d2 = new Date(end)
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months
}
export const formatLocalTime =(timestamp) => {
    const localTime = new Date(timestamp).toLocaleString("vi-VN", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      });
    
      return localTime;
}