function addMonths(date, count) {
    if (date && count) {
        var m, d = (date = new Date(+date)).getDate()

        date.setMonth(date.getMonth() + count, 1)
        m = date.getMonth()
        date.setDate(d)
        if (date.getMonth() !== m) date.setDate(0)
    }
    return date
}

module.exports = { addMonths }