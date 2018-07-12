function SSHModel (conn) {
    this.conn = conn
    return this
}
SSHModel.prototype = {
    constructor: SSHModel,
    connect: function (option) {
        if (!option) {
            throw new Error('not find host config')
        }
        this.conn.connect(option)
    },
    close: function () {
        this.conn.end()
    },
    sshExec: function (cmd) {
        if (!this.conn) {
            throw new Error('conn not init')
        }
        this.conn.on('ready', () => {
            this.conn.exec(cmd, (error, stream) => {
                if (error) throw error;
                stream.on('close', (code, signal) => {
                    this.conn.end()
                }).on('data', (data) => {
                    console.log('stdout : ', data.toString())
                }).stderr.on('data', (data) => {
                    console.log('stderr : ', data.toString())
                })
            })
        })
    }
}
module.exports = SSHModel
