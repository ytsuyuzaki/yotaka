import { expect } from 'chai'
import { buildMediaList, isSupportedMediaFile } from '../../../../src/main/feed-utils'

describe('feed-utils', () => {
  describe('isSupportedMediaFile', () => {
    it('supports expected media extensions', () => {
      expect(isSupportedMediaFile('/tmp/a.m4a')).to.equal(true)
      expect(isSupportedMediaFile('/tmp/a.MP3')).to.equal(true)
      expect(isSupportedMediaFile('/tmp/a.mov')).to.equal(true)
      expect(isSupportedMediaFile('/tmp/a.mp4')).to.equal(true)
      expect(isSupportedMediaFile('/tmp/a.m4v')).to.equal(true)
      expect(isSupportedMediaFile('/tmp/a.txt')).to.equal(false)
    })
  })

  describe('buildMediaList', () => {
    it('filters unsupported files and sorts by access time desc', () => {
      const baseUrl = 'http://127.0.0.1:4350'
      const files = [
        '/media/old.mp3',
        '/media/ignore.txt',
        '/media/new.M4A'
      ]
      const statMap = {
        '/media/old.mp3': new Date('2024-01-01T00:00:00.000Z'),
        '/media/new.M4A': new Date('2024-02-01T00:00:00.000Z')
      }
      const statSync = file => ({ atime: statMap[file] })

      const list = buildMediaList(files, baseUrl, statSync)

      expect(list).to.have.lengthOf(2)
      expect(list.map(item => item.file)).to.deep.equal([
        '/media/new.M4A',
        '/media/old.mp3'
      ])
      expect(list[0]).to.deep.include({
        file: '/media/new.M4A',
        title: 'new',
        url: 'http://127.0.0.1:4350/media/new.M4A',
        duration: ''
      })
      expect(list[1]).to.deep.include({
        file: '/media/old.mp3',
        title: 'old',
        url: 'http://127.0.0.1:4350/media/old.mp3',
        duration: ''
      })
    })
  })
})
