export const timeCovert = function(time) {
    let timeObj = new Date(time);
    let year = timeObj.getFullYear();
    let month = timeObj.getMonth() + 1;
    let day = timeObj.getDate();
    let hour = timeObj.getHours();
    let min = timeObj.getMinutes();
    let sec = timeObj.getSeconds();
    return `${year}年${month}月${day}日${hour}:${min < 10 ? 0 : ''}${min}:${sec < 10 ? 0 : ''}${sec}`;
};