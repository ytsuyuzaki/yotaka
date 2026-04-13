import express from 'express'
import Podcast from 'podcast'
import path from 'path'
import util from 'util'
import Store from 'electron-store'
import log from 'electron-log'
import fs from 'fs'
import { buildMediaList } from './feed-utils'
// import { getAudioDurationInSeconds } from 'get-audio-duration'

const glob = util.promisify(require('glob'))

const store = new Store()

const app = express()
app.use('/static', express.static(__static))
app.use('/media', express.static(store.get('media.path')))

app.get('/rss.xml', async function (req, res) {
  try {
    res.set('Content-Type', 'text/xml; charset=utf-8')

    // 音声ファイルの取得パス作成、store.get('media.path')は可変なのでrss取得時に再設定
    app.use('/media', express.static(store.get('media.path')))

    const imageUrl = __url + '/static/feed_icon.png'
    const feed = new Podcast({
      title: 'yotaka',
      description: '家庭内Podcast配信サーバー',
      site_url: 'https://github.com/soramugi/yotaka',
      image_url: imageUrl,
      docs: 'https://github.com/soramugi/yotaka',
      author: 'yotaka',
      // pubDate: 'May 20, 2012 04:00:00 GMT',
      itunesImage: imageUrl,
      itunesSummary: '',
      itunesAuthor: 'yotaka'
    })

    const files = await glob(path.join(store.get('media.path'), '*.*'))

    const list = buildMediaList(files, __url, fs.statSync)

    for (const data of list) {
      const file = data.file
      const date = data.date
      const title = data.title
      const url = data.url
      const duration = data.duration
      feed.addItem({
        title,
        url,
        description: title,
        date,
        enclosure: {
          url,
          file
        },
        itunesSubtitle: title,
        itunesDuration: duration
      })
    }

    res.send(feed.buildXml('  '))
  } catch (e) {
    log.error('express')
    log.error(e)
    log.error(e.stack)
    res.send(e)
  }
})

app.listen(__port, () => console.log('App listening on port ' + __port + '!'))
