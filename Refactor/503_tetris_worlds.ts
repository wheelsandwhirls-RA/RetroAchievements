import { AchievementSet, define as $ } from '@cruncheevos/core'
const set = new AchievementSet({ gameId: 503, title: 'Tetris Worlds' })

function format(str: string, ...args: any[]): string {
    return str.replace(/{(\d+)}/g, (match, index) => {
        return typeof args[index] !== 'undefined' ? args[index] : match;
    });
}

const Mode: Record<string, number> = {
  Tetris: 0,
  Sticky: 1,
  Fusion: 2,
  HotLine: 3,
  Square: 4,
  Cascade: 5,
  Popular: 6,
};

const Song: Record<string, number> = {
  TetrisTheme: 0,
  SugaredCubes: 1,
  Faster: 2,
  MinoUet: 3,
  SquareDance: 4,
  LineDance: 5,
  Random: 6,
};

const Piece: Record<string, number> = {
  T: 1,
  J: 2,
  L: 3,
  S: 4,
  Z: 5,
  I: 6,
  O: 7,
};

const MusicVolume = (cmp, val) => $(['', 'Mem', '32bit', 0x0134, cmp, 'Value', '', val])
const SongSetting = (song) => $(['', 'Mem', '32bit', 0x0140, '=', 'Value', '', Song[song]])
const StartingLevel = (cmp, val) => $(['', 'Mem', '32bit', 0x0150, cmp, 'Value', '', val])

const InGame = (flag = '') => $([flag, 'Delta', '32bit', 0x7adc, '=', 'Value', '', 3], [flag, 'Mem', '32bit', 0x7adc, '=', 'Value', '', 3])
const ResetIfNotInGame = () => $(['ResetIf', 'Delta', '32bit', 0x7adc, '!=', 'Value', '', 3], ['ResetIf', 'Mem', '32bit', 0x7adc, '!=', 'Value', '', 3])
const IsMode = (mode) => $(['', 'Mem', '32bit', 0x78d0, '=', 'Value', '', Mode[mode]])
const IsNotPopularMode = (flag = '') => $([flag, 'Mem', '32bit', 0x78d0, '<=', 'Value', '', 5])
const ResetIfNotMode = (mode) => $(['ResetIf', 'Mem', '32bit', 0x78d0, '!=', 'Value', '', Mode[mode]])
const IsNotPaused = (flag) => $([flag, 'Mem', '32bit', 0x0b98, '=', 'Value', '', 0x0])
const PauselockIfPaused = () => $(['ResetNextIf', 'Mem', '32bit', 0x7adc, '!=', 'Value', '', 3], ['PauseIf', 'Mem', '32bit', 0x0b98, '!=', 'Value', '', 0x0, 1])
const IsMarathon = () => $(['', 'Mem', '8bit', 0x78d4, '=', 'Value', '', 0])
const IsUltra = () => $(['', 'Mem', '8bit', 0x78d4, '=', 'Value', '', 1])

const StartGameCheckpoint = () => $(['AndNext', 'Delta', '32bit', 0x7adc, '=', 'Value', '', 2], ['', 'Mem', '32bit', 0x7adc, '=', 'Value', '', 3, 1])
const ResetIfMenu = () => $(['ResetIf', 'Mem', '32bit', 0x7adc, '=', 'Value', '', 6])

const TotalLinesCleared = (n) => $(['', 'Mem', '32bit', 0x3458, '=', 'Value', '', n])
const AnyLinesCleared = (hits) => $(['AndNext', 'Delta', '16bit', 0x3426, '>=', 'Value', '', 1], ['', 'Mem', '16bit', 0x3426, '=', 'Value', '', 0, hits])
const LinesClearedAtLeast = (n, hits = 0) => $(['AndNext', 'Delta', '16bit', 0x3426, '>=', 'Value', '', n], ['', 'Mem', '16bit', 0x3426, '=', 'Value', '', 0, ...(hits === 0 ? [] : [hits])])
const LinesCleared = (n, hits = 0, flag = '') => $([hits === 0? '' : 'AndNext', 'Delta', '16bit', 0x3426, '=', 'Value', '', n], [flag, 'Mem', '16bit', 0x3426, '=', 'Value', '', 0, ...(hits === 0 ? [] : [hits])])
const LinesClearedPopular = (n) => $(['', 'Delta', '32bit', 0x7858, '=', 'Value', '', n], ['', 'Mem', '32bit', 0x7858, '=', 'Value', '', 0])

const ResetIfNonTetris = () => $(
  ['AndNext', 'Delta', '16bit', 0x3426, '=', 'Value', '', 1], ['ResetIf', 'Mem', '16bit', 0x3426, '=', 'Value', '', 0],
  ['AndNext', 'Delta', '16bit', 0x3426, '=', 'Value', '', 2], ['ResetIf', 'Mem', '16bit', 0x3426, '=', 'Value', '', 0],
  ['AndNext', 'Delta', '16bit', 0x3426, '=', 'Value', '', 3], ['ResetIf', 'Mem', '16bit', 0x3426, '=', 'Value', '', 0],
)

const LevelAtLeast = (n) => $(['', 'Mem', '32bit', 0x3454, '>=', 'Value', '', n])
const ReachedLevel = (n, flag = '') => $(['', 'Delta', '32bit', 0x3454, '=', 'Value', '', n-1], [flag, 'Mem', '32bit', 0x3454, '=', 'Value', '', n])
const ReachedLevelPopular = (n) => $(['', 'Delta', '32bit', 0x7828, '=', 'Value', '', n-2], ['', 'Mem', '32bit', 0x7828, '=', 'Value', '', n-1])
const ReachedScorePopular = (n) => $(['', 'Delta', '32bit', 0x782c, '<', 'Value', '', n], ['', 'Mem', '32bit', 0x782c, '>=', 'Value', '', n])

const RecentPiece = (piece) => $(
  ['AddAddress', 'Mem', '24bit', 0x3394], ['AddAddress', 'Mem', '24bit', 0x8030], ['AddAddress', 'Mem', '24bit', 0x801c], ['', 'Prior', '32bit', 0x8010, '=', 'Value', '', Piece[piece]],
  ['AddAddress', 'Mem', '24bit', 0x3394], ['AddAddress', 'Mem', '24bit', 0x8030], ['AddAddress', 'Mem', '24bit', 0x801c], ['', 'Mem', '32bit', 0x8010, '=', 'Value', '', 0],
)

const BlockPtr = (i, j, type, cmp, value, flag = '') => $([flag, type, '24bit', 0x4060 - (i * 0xa0) + (j * 0x10), cmp, 'Value', '', value])
const Block = (i, j, type, cmp, value, flag = '') => $(['AddAddress', 'Mem', '24bit', 0x4060 - (i * 0xa0) + (j * 0x10)], [flag, type, '16bit', 0x8060, cmp, 'Value', '', value])

const FramesWithSamePiece = (n) => $(['AddAddress', 'Mem', '24bit', 0x33a0], ['', 'Mem', '8bit', 0x8004, '=', 'Delta', '8bit', 0x8004, n])
const ResetIfNextPiece = () => $(['AddAddress', 'Mem', '24bit', 0x33a0], ['ResetIf', 'Mem', '8bit', 0x8004, '!=', 'Delta', '8bit', 0x8004])

const GameWon = (flag = '') => $(['', 'Delta', '32bit', 0x78d8, '=', 'Value', '', 0], [flag, 'Mem', '32bit', 0x78d8, '=', 'Value', '', 1])

set.addAchievement({
  id: 302975,
  badge: '336832',
  title: 'Single Pringle',
  description: 'Break a single line in any mode',
  points: 1,
  type: 'progression',
  conditions: {
    core: $(InGame()),
    alt1: $(IsMode('Popular'), LinesClearedPopular(1)),
    alt2: $(IsNotPopularMode(), LinesCleared(1)),
  },
})

set.addAchievement({
  id: 302976,
  badge: '336833',
  title: 'Double Trouble',
  description: 'Break 2 lines at once in any mode',
  points: 1,
  type: 'progression',
  conditions: {
    core: $(InGame()),
    alt1: $(IsMode('Popular'), LinesClearedPopular(2)),
    alt2: $(IsNotPopularMode(), LinesCleared(2)),
  },
})

set.addAchievement({
  id: 302977,
  badge: '336834',
  title: 'Triple Threat',
  description: 'Break 3 lines at once in any mode',
  points: 1,
  type: 'progression',
  conditions: {
    core: $(InGame()),
    alt1: $(IsMode('Popular'), LinesClearedPopular(3)),
    alt2: $(IsNotPopularMode(), LinesCleared(3)),
  },
})

set.addAchievement({
  id: 302978,
  badge: '336835',
  title: 'Obligatory Tetris Achievement',
  description: 'Break 4 lines at once in any mode',
  points: 1,
  type: 'progression',
  conditions: {
    core: $(InGame()),
    alt1: $(IsMode('Popular'), LinesClearedPopular(4)),
    alt2: $(IsNotPopularMode(), LinesCleared(4)),
  },
})

set.addAchievement({
  id: 302979,
  badge: '336836',
  title: 'Twentris',
  description: 'Perform 20 Tetrises in one game of Tetris mode',
  points: 3,
  conditions: $(ResetIfNotInGame(), ResetIfNotMode('Tetris'), LinesCleared(4, 20, 'Measured')),
})

set.addAchievement({
  id: 302980,
  badge: '337051',
  title: 'So You Know SRS, Huh?',
  description: 'Perform a T-Spin Triple in Tetris mode',
  points: 3,
  conditions: $(InGame(), IsMode('Tetris'), RecentPiece('T'), LinesCleared(3))
})


set.addAchievement({
  id: 302981,
  badge: '336838',
  title: 'Fusion Reactor',
  description: 'Fill an entire row with Atoms connected to a Fusion Block in Fusion mode',
  points: 3,
  conditions: {
    core: $(InGame(), IsMode('Fusion')),
    ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`alt${i + 1}`, $(
      ...Array.from({ length: 10 }, (_, j) => $(Block(i, j, 'Delta', '!=', 8364, j == 9 ? '' : 'OrNext'))),
      ...Array.from({ length: 10 }, (_, j) => $(Block(i, j, 'Mem', '=', 8364))),
    )])),
  },
})

set.addAchievement({
  id: 302982,
  badge: '336839',
  title: 'Danger Zone',
  description: 'Break a line on the highest hot line on the board in Hot-Line mode',
  points: 3,
  conditions: $(
    InGame(), IsMode('HotLine'),
    ...Array.from({ length: 10 }, (_, j) => $(BlockPtr(17, j, 'Delta', '=', 0, j == 9 ? '' : 'OrNext'))),
    ...Array.from({ length: 10 }, (_, j) => $(BlockPtr(17, j, 'Mem', '!=', 0))),
  ),
})

set.addAchievement({
  id: 302983,
  badge: '336840',
  title: 'Silver Platter',
  description: 'Create a large Silver block in Square mode',
  points: 2,
  conditions: {
    core: $(InGame(), IsMode('Square')),
    alt1: $(
      ...Array.from({ length: 10 }, (_, j) => $(Block(3, j, 'Delta', '!=', 8536))),
      ...Array.from({ length: 10 }, (_, j) => $(Block(3, j, 'Mem', '=', 8536, j == 9 ? '' : 'OrNext')))
    ),
    alt2: $(
      ...Array.from({ length: 10 }, (_, j) => $(Block(7, j, 'Delta', '!=', 8536))),
      ...Array.from({ length: 10 }, (_, j) => $(Block(7, j, 'Mem', '=', 8536, j == 9 ? '' : 'OrNext')))
    ),
    alt3: $(
      ...Array.from({ length: 10 }, (_, j) => $(Block(11, j, 'Delta', '!=', 8536))),
      ...Array.from({ length: 10 }, (_, j) => $(Block(11, j, 'Mem', '=', 8536, j == 9 ? '' : 'OrNext')))
    ),
    alt4: $(
      ...Array.from({ length: 10 }, (_, j) => $(Block(15, j, 'Delta', '!=', 8536))),
      ...Array.from({ length: 10 }, (_, j) => $(Block(15, j, 'Mem', '=', 8536, j == 9 ? '' : 'OrNext')))
    ),
    alt5: $(
      ...Array.from({ length: 10 }, (_, j) => $(Block(19, j, 'Delta', '!=', 8536))),
      ...Array.from({ length: 10 }, (_, j) => $(Block(19, j, 'Mem', '=', 8536, j == 9 ? '' : 'OrNext')))
    ),
  },
})

set.addAchievement({
  id: 302984,
  badge: '336841',
  title: 'Solid Gold',
  description: 'Create a large Gold block in Square mode',
  points: 3,
  conditions: {
    core: $(InGame(), IsMode('Square')),
    alt1: $(
      ...Array.from({ length: 10 }, (_, j) => $(Block(3, j, 'Delta', '!=', 9224))),
      ...Array.from({ length: 10 }, (_, j) => $(Block(3, j, 'Mem', '=', 9224, j == 9 ? '' : 'OrNext')))
    ),
    alt2: $(
      ...Array.from({ length: 10 }, (_, j) => $(Block(7, j, 'Delta', '!=', 9224))),
      ...Array.from({ length: 10 }, (_, j) => $(Block(7, j, 'Mem', '=', 9224, j == 9 ? '' : 'OrNext')))
    ),
    alt3: $(
      ...Array.from({ length: 10 }, (_, j) => $(Block(11, j, 'Delta', '!=', 9224))),
      ...Array.from({ length: 10 }, (_, j) => $(Block(11, j, 'Mem', '=', 9224, j == 9 ? '' : 'OrNext')))
    ),
    alt4: $(
      ...Array.from({ length: 10 }, (_, j) => $(Block(15, j, 'Delta', '!=', 9224))),
      ...Array.from({ length: 10 }, (_, j) => $(Block(15, j, 'Mem', '=', 9224, j == 9 ? '' : 'OrNext')))
    ),
    alt5: $(
      ...Array.from({ length: 10 }, (_, j) => $(Block(19, j, 'Delta', '!=', 9224))),
      ...Array.from({ length: 10 }, (_, j) => $(Block(19, j, 'Mem', '=', 9224, j == 9 ? '' : 'OrNext')))
    ),
  },
})

set.addAchievement({
  id: 302985,
  badge: '336842',
  title: 'Who Switched the Gravity Back On?',
  description: 'Cascade pieces to create a chain reaction of line breaks in Cascade mode',
  points: 2,
  conditions: $(InGame(), IsMode('Cascade'), AnyLinesCleared(2), ResetIfNextPiece()),
})

set.addAchievement({
  id: 302986,
  badge: '336843',
  title: 'Tetris Plus',
  description: 'Break 5 or more lines with one piece drop in Cascade mode',
  points: 3,
  conditions: {
    core: $(InGame(), IsMode('Cascade'), ResetIfNextPiece()),
    alt1: $(LinesCleared(1, 5)),
    alt2: $(LinesCleared(1, 3), LinesCleared(2, 1)),
    alt3: $(LinesCleared(1, 2), LinesCleared(3, 1)),
    alt4: $(LinesCleared(1, 1), LinesCleared(4, 1)),
    alt5: $(LinesCleared(1, 1), LinesCleared(2, 2)),
    alt6: $(LinesCleared(1, 1), LinesCleared(3, 2)),
    alt7: $(LinesCleared(1, 1), LinesCleared(2, 1), LinesCleared(3, 1)),
    alt8: $(LinesCleared(2, 3)),
    alt9: $(LinesCleared(2, 1), LinesCleared(3, 1)),
    alt10: $(LinesCleared(2, 1), LinesCleared(4, 1)),
    alt11: $(LinesCleared(3, 2)),
    alt12: $(LinesCleared(3, 1), LinesCleared(4, 1)),
    alt13: $(LinesCleared(4, 2)),
    alt14: $(LinesClearedAtLeast(5, 1)),
  },
})

set.addAchievement({
  id: 302987,
  badge: '336844',
  title: 'Tetris Times Tetris',
  description: 'Break 8 or more lines, including at least 2 Tetrises, with one piece drop in Cascade mode',
  points: 5,
  conditions: {
    core: $(InGame(), IsMode('Cascade'), ResetIfNextPiece()),
    alt1: $(LinesClearedAtLeast(4, 2)),
    alt2: $(LinesClearedAtLeast(8, 1)),
  },
})

set.addAchievement({
  id: 302988,
  badge: '336845',
  title: 'Hitting the Speed Cap',
  description: 'Reach Level 15 from a Level 1 start on Popular mode without pausing',
  points: 3,
  conditions: $(InGame(), IsMode('Popular'), StartingLevel('=', 1), ReachedLevelPopular(15)),
})

set.addAchievement({
  id: 302989,
  badge: '336846',
  title: 'Old School 100k',
  description: 'Score 100,000 points or more on Popular mode without pausing',
  points: 10,
  conditions: $(InGame(), IsMode('Popular'), ReachedScorePopular(100000), PauselockIfPaused()),
})

set.addAchievement({
  id: 302990,
  badge: '336847',
  title: 'Professional Tetris',
  description: 'Clear Marathon Tetris starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsMarathon(), IsMode('Tetris'), StartingLevel('=', 1), LevelAtLeast(1), GameWon('Trigger')),
})

set.addAchievement({
  id: 302991,
  badge: '336848',
  title: 'Professional Sticky',
  description: 'Clear Marathon Sticky starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsMarathon(), IsMode('Sticky'), StartingLevel('=', 1), LevelAtLeast(1), GameWon('Trigger')),
})

set.addAchievement({
  id: 302992,
  badge: '336849',
  title: 'Professional Fusion',
  description: 'Clear Marathon Fusion starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsMarathon(), IsMode('Fusion'), StartingLevel('=', 1), LevelAtLeast(1), GameWon('Trigger')),
})

set.addAchievement({
  id: 302993,
  badge: '336850',
  title: 'Professional Hot-Line',
  description: 'Clear Marathon Hot-Line starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsMarathon(), IsMode('HotLine'), StartingLevel('=', 1), LevelAtLeast(1), GameWon('Trigger')),
})

set.addAchievement({
  id: 302994,
  badge: '336851',
  title: 'Professional Square',
  description: 'Clear Marathon Square starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsMarathon(), IsMode('Square'), StartingLevel('=', 1), LevelAtLeast(1), GameWon('Trigger')),
})

set.addAchievement({
  id: 302995,
  badge: '336852',
  title: 'Professional Cascade',
  description: 'Clear Marathon Cascade starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsMarathon(), IsMode('Cascade'), StartingLevel('=', 1), LevelAtLeast(1), GameWon('Trigger')),
})

set.addAchievement({
  id: 302996,
  badge: '336853',
  title: 'Two Minute Tetris',
  description: 'Clear Ultra Tetris starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsUltra(), IsMode('Tetris'), StartingLevel('=', 1), LevelAtLeast(1), GameWon('Trigger')),
})

set.addAchievement({
  id: 302997,
  badge: '336854',
  title: 'Two Minute Sticky',
  description: 'Clear Ultra Sticky starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsUltra(), IsMode('Sticky'), StartingLevel('=', 1), LevelAtLeast(1), GameWon('Trigger')),
})

set.addAchievement({
  id: 302998,
  badge: '336855',
  title: 'Two Minute Fusion',
  description: 'Reach Level 10 in Ultra Fusion starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsUltra(), IsMode('Fusion'), StartingLevel('=', 1), LevelAtLeast(1), ReachedLevel(10, 'Trigger')),
})

set.addAchievement({
  id: 302999,
  badge: '336856',
  title: 'Two Minute Hot-Line',
  description: 'Clear Ultra Hot-Line starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsUltra(), IsMode('HotLine'), StartingLevel('=', 1), LevelAtLeast(1), GameWon('Trigger')),
})

set.addAchievement({
  id: 303000,
  badge: '336857',
  title: 'Two Minute Square',
  description: 'Clear Ultra Square starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsUltra(), IsMode('Square'), StartingLevel('=', 1), LevelAtLeast(1), GameWon('Trigger')),
})

set.addAchievement({
  id: 303001,
  badge: '336858',
  title: 'Two Minute Cascade',
  description: 'Clear Ultra Cascade starting from Level 1',
  points: 10,
  type: 'win_condition',
  conditions: $(IsUltra(), IsMode('Cascade'), StartingLevel('=', 1), LevelAtLeast(1), GameWon('Trigger')),
})

set.addAchievement({
  id: 303002,
  badge: '336859',
  title: 'Just Keep Spinning',
  description: 'Keep the same piece in play for over 30 seconds, in any mode other than Popular',
  points: 2,
  conditions: $(InGame('AndNext'), IsNotPopularMode('AndNext'), IsNotPaused('AndNext'), FramesWithSamePiece(1800), ResetIfNextPiece()),
})

set.addAchievement({
  id: 303003,
  badge: '336860',
  title: 'One and Done',
  description: 'Clear any Marathon mode, other than Popular, starting from Level 15',
  points: 5,
  conditions: $(IsMarathon(), IsNotPopularMode(), StartingLevel('=', 15), GameWon('Trigger'))
})

set.addAchievement({
  id: 303004,
  badge: '336861',
  title: 'No Time to Stack',
  description: 'Clear any Ultra mode from Level 15',
  points: 5,
  conditions: $(IsUltra(), StartingLevel('=', 15), GameWon('Trigger'))
})

set.addAchievement({
  id: 303005,
  badge: '336862',
  title: 'BOOM, Tetris for Jeff',
  description: 'Perform a Tetris in Popular mode with the Song option set to Sugared Cubes and Music volume higher than zero',
  points: 2,
  conditions: $(InGame(), IsMode('Popular'), SongSetting('SugaredCubes'), MusicVolume('>', 0), LinesClearedPopular(4))
})

set.addAchievement({
  id: 303007,
  badge: '336863',
  title: 'Longbar Hoarder',
  description: 'Perform a Tetris with only I-pieces in the bottom four rows in Marathon Tetris',
  points: 10,
  conditions: $(
    InGame(), IsMarathon(), IsMode('Tetris'),
    ...Array.from({ length: 10 }, (_, j) => $(Block(0, j, 'Delta', '!=', 7332, 'OrNext'))),
    ...Array.from({ length: 10 }, (_, j) => $(Block(1, j, 'Delta', '!=', 7332, 'OrNext'))),
    ...Array.from({ length: 10 }, (_, j) => $(Block(2, j, 'Delta', '!=', 7332, 'OrNext'))),
    ...Array.from({ length: 10 }, (_, j) => $(Block(3, j, 'Delta', '!=', 7332, j == 9 ? '' : 'OrNext'))),
    ...Array.from({ length: 10 }, (_, j) => $(Block(0, j, 'Mem', '=', 7332))),
    ...Array.from({ length: 10 }, (_, j) => $(Block(1, j, 'Mem', '=', 7332))),
    ...Array.from({ length: 10 }, (_, j) => $(Block(2, j, 'Mem', '=', 7332))),
    ...Array.from({ length: 10 }, (_, j) => $(Block(3, j, 'Mem', '=', 7332))),
  ),
})

set.addAchievement({
  id: 303008,
  badge: '336864',
  title: 'Yearning For The Joystick',
  description: 'Perform the first half of secret grade in Marathon Tetris',
  points: 10,
  conditions: $(
    InGame(), IsMarathon(), IsMode('Tetris'),
    ...Array.from({ length: 10 }, (_, i) => $(
      ...Array.from({ length: 10 }, (_, j) => $(BlockPtr(i, j, 'Delta', i == j ? '!=' : '=', 0, j == 9 && i == 9 ? '' : 'OrNext'))),
    )),
    ...Array.from({ length: 10 }, (_, i) => $(
      ...Array.from({ length: 10 }, (_, j) => $(BlockPtr(i, j, 'Mem', i == j ? '=' : '!=', 0))),
    )),
  ),
})

set.addAchievement({
  id: 303009,
  badge: '336865',
  title: 'Perfectionist',
  description: 'Clear Marathon Tetris from Level 1 with only Tetrises',
  points: 25,
  conditions: $(StartGameCheckpoint(), IsMarathon(), IsMode('Tetris'), StartingLevel('=', 1), GameWon('Trigger'), ResetIfNonTetris(), ResetIfMenu())
})

set.addAchievement({
  id: 303010,
  badge: '336866',
  title: 'GBA Maxout',
  description: 'Score 999,999 points or more on Popular without pausing',
  points: 50,
  conditions: $(InGame(), IsMode('Popular'), ReachedScorePopular(999999), PauselockIfPaused()),
})

function AddMarathonLeaderboard(id, mode, modeKey) {
set.addLeaderboard({
  id: id,
  title: format('Marathon {0} Speedrun', mode),
  description: format('Fastest time to beat Marathon {0} starting from Level 1', mode),
  lowerIsBetter: true,
  type: 'TIMESECS',
  conditions: {
    start: $(IsMarathon(), IsMode(modeKey), StartingLevel('=', 1), GameWon()),
    cancel: $(['', 'Value', '', 0, '=', 'Value', '', 1]),
    submit: $(['', 'Value', '', 0, '=', 'Value', '', 0]),
    value: $(['Measured', 'Mem', '16bit', 0x33d2]),
  },
})
}

AddMarathonLeaderboard(61828, 'Tetris', 'Tetris')
AddMarathonLeaderboard(61829, 'Sticky', 'Sticky')
AddMarathonLeaderboard(61830, 'Fusion', 'Fusion')
AddMarathonLeaderboard(61831, 'Hot-Line', 'HotLine')
AddMarathonLeaderboard(61832, 'Square', 'Square')
AddMarathonLeaderboard(61833, 'Cascade', 'Cascade')

set.addLeaderboard({
  id: 61834,
  title: 'Old School High-Score',
  description: 'Highest score on Popular mode',
  lowerIsBetter: false,
  type: 'VALUE',
  conditions: {
    start: $(IsMode('Popular'), ['', 'Delta', '32bit', 0x7adc, '=', 'Value', '', 3], ['', 'Mem', '32bit', 0x7adc, '=', 'Value', '', 5]),
    cancel: $(['', 'Value', '', 0, '=', 'Value', '', 1]),
    submit: $(['', 'Value', '', 0, '=', 'Value', '', 0]),
    value: $(['Measured', 'Delta', '32bit', 0x782c]),
  },
})

export default set
