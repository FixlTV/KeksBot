const process = require("process")
const rdl = require("readline")
class LoadingBar {
    constructor(size) {
        this.size = size
        this.progress = 0
        this.ended = false
    }
    start() {
        process.stdout.write("\x1B[?25l")
        for (let i = 0; i < this.size; i++) {
            process.stdout.write("-")
        }
    }
    add(count) {
        if(!count) return new Error('Anzahl der hinzuzufügenden Elemente fehlt.')
        this.progress += count
        if(this.progress > this.size) this.progress = this.size
        this.update()
    }
    remove(count) {
        if(!count) return new Error('Anzahl der zu entfernenden Elemente fehlt.')
        this.progress = this.progress - count
        if(this.progress < 0) this.progress = 0
        this.update()
    }
    set(count) {
        if(!count) return new Error('Anzahl der zu entfernenden Elemente fehlt.')
        if(count < 0) count = 0
        if(count > this.size) count = this.size
        this.progress = count
    }
    end(text) {
        process.stdout.write("\x1B[?25l")
        rdl.cursorTo(process.stdout, 0)
        if(text) {
            process.stdout.write(text)
            while(text.length > this.size) process.stdout.write(' ')
        }
        rdl.moveCursor(process.stdout, 0, 1)
    }
    update() {
        process.stdout.write("\x1B[?25l")
        rdl.cursorTo(process.stdout, 0)
        for(let i = 0; i < this.size; i++) {
            process.stdout.write("-")
        }
        rdl.cursorTo(process.stdout, 0)
        var progress = 0
        while (progress < this.progress) {
            process.stdout.write('#')
            progress++
        }
    }
}
module.exports = LoadingBar