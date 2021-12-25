
class DateFormats  {
    constructor(){
    }

    x = (value) => {
        return ('0' + value).slice(-2)
    }
    timeShort = (t, long) => {
        var hours = this.x(t.getHours())
        var minutes = this.x(t.getMinutes())
        var journal = hours <= 11 ? 'AM' : 'PM'
        var seconds = long ? this.x(t.getSeconds()) + ' ' : ' ' 
        var hour = hours > 12 ? hours - 12 : hours
        return hour + ':' + minutes + seconds + journal
    }
    timeLong = (t) => {
        return this.timeShort(t, long)
    }
    date = (d) => {
        return this.x(d.getDate()) + '/' + this.x(d.getMonth()+1) + '/' + d.getFullYear()
    }
    /* dateNew = (d) => {
        return this.x(d.getDate()) + '/' + this.x(d.getMonth()+1) + '/' + d.getFullYear()
    } */
    dateTime = (d) => {
        return this.date(d) + ' ' + this.timeShort(d)
    }
    code = (d) => {
        return d.getFullYear() + '' + this.x(d.getMonth()+1) + '' + this.x(d.getDate()) + '' + this.x(d.getHours()) + '' + this.x(d.getMinutes()) + '' + this.x(d.getSeconds())
    }
    codeShort = (d) => {
        return d.getFullYear() + '' + this.x(d.getMonth()+1) + '' + this.x(d.getDate())
    }
};

var dateFormats = new DateFormats()
export default dateFormats



