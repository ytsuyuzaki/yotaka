import { expect } from 'chai'
import { buildMediaList, isSupportedMediaFile } from '../../../src/main/feed-utils'

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

    it('is case-insensitive for all supported extensions', () => {
      expect(isSupportedMediaFile('/tmp/a.M4A')).to.equal(true)
      expect(isSupportedMediaFile('/tmp/a.MP4')).to.equal(true)
      expect(isSupportedMediaFile('/tmp/a.MOV')).to.equal(true)
      expect(isSupportedMediaFile('/tmp/a.M4V')).to.equal(true)
      expect(isSupportedMediaFile('/tmp/a.Mp3')).to.equal(true)
    })

    it('returns false for an empty string', () => {
      expect(isSupportedMediaFile('')).to.equal(false)
    })

    it('returns false for a file with no extension', () => {
      expect(isSupportedMediaFile('/tmp/audiofile')).to.equal(false)
    })

    it('returns false for unsupported extensions', () => {
      expect(isSupportedMediaFile('/tmp/a.wav')).to.equal(false)
      expect(isSupportedMediaFile('/tmp/a.ogg')).to.equal(false)
      expect(isSupportedMediaFile('/tmp/a.flac')).to.equal(false)
      expect(isSupportedMediaFile('/tmp/a.pdf')).to.equal(false)
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

    it('returns an empty list for empty input', () => {
      const list = buildMediaList([], 'http://host', () => {})
      expect(list).to.have.lengthOf(0)
    })

    it('returns an empty list when all files are unsupported', () => {
      const files = ['/media/a.txt', '/media/b.doc', '/media/c.wav']
      const list = buildMediaList(files, 'http://host', () => ({ atime: new Date() }))
      expect(list).to.have.lengthOf(0)
    })

    it('handles a single supported file', () => {
      const files = ['/media/podcast.mp3']
      const statSync = () => ({ atime: new Date('2024-01-01') })
      const list = buildMediaList(files, 'http://host', statSync)
      expect(list).to.have.lengthOf(1)
      expect(list[0].title).to.equal('podcast')
      expect(list[0].url).to.equal('http://host/media/podcast.mp3')
      expect(list[0].duration).to.equal('')
    })

    it('builds correct url using path.basename so nested paths are flattened', () => {
      const files = ['/deep/nested/dir/episode.mp4']
      const statSync = () => ({ atime: new Date('2024-01-01') })
      const list = buildMediaList(files, 'http://host', statSync)
      expect(list[0].url).to.equal('http://host/media/episode.mp4')
    })

    it('includes atime as the date property', () => {
      const atime = new Date('2024-06-15T12:00:00.000Z')
      const files = ['/media/track.m4a']
      const statSync = () => ({ atime })
      const list = buildMediaList(files, 'http://host', statSync)
      expect(list[0].date).to.equal(atime)
    })

    it('includes all files with equal access time', () => {
      const sameTime = new Date('2024-01-01')
      const files = ['/media/a.mp3', '/media/b.mp3']
      const statSync = () => ({ atime: sameTime })
      const list = buildMediaList(files, 'http://host', statSync)
      expect(list).to.have.lengthOf(2)
      const titles = list.map(item => item.title)
      expect(titles).to.include('a')
      expect(titles).to.include('b')
    })
  })
})
