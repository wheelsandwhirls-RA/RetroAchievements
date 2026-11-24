import { AchievementSet, define as $ } from '@cruncheevos/core'
const set = new AchievementSet({ gameId: 853, title: 'The Chessmaster' })

const StartGameCheckpoint = () => $(['AndNext', 'Delta', '8bit', 0x1456, '=', 'Value', '', 0], ['', 'Mem', '8bit', 0x1456, '=', 'Value', '', 1, 1])
const ResetIfEnteredSetupBoard = () => $(['ResetIf', 'Mem', '8bit', 0x080e, '=', 'Value', '', 1])
const ResetIfReplay = () => $(['ResetIf', 'Mem', 'Bit0', 0x080c, '=', 'Value', '', 1])
const ResetIfNotSinglePlayer = () => $(['ResetIf', 'Mem', '8bit', 0x0810, '!=', 'Value', '', 0])
const ResetIfGameManipulated = () => $(ResetIfEnteredSetupBoard(), ResetIfReplay(), ResetIfNotSinglePlayer())
const ResetIfNotWhite = () => $(['ResetIf', 'Mem', '8bit', 0x080d, '!=', 'Value', '', 0])
const ResetIfNotBlack = () => $(['ResetIf', 'Mem', '8bit', 0x080d, '!=', 'Value', '', 1])
const ResetIfMoveWithLevelBelow = (n) => $(['AndNext', 'Mem', '8bit', 0x14a4, '>', 'Delta', '8bit', 0x14a4], ['ResetIf', 'Mem', '8bit', 0x0800, '<', 'Value', '', n])
const ResetIfNot2D = () => $(['ResetIf', 'Mem', '8bit', 0x0805, '!=', 'Value', '', 0])
const ResetIfNot3D = () => $(['ResetIf', 'Mem', '8bit', 0x0805, '!=', 'Value', '', 1])
const ResetIfNotWarRoom = () => $(['ResetIf', 'Mem', '8bit', 0x0805, '!=', 'Value', '', 2])
const ResetIfNotStaunton = () => $(['ResetIf', 'Mem', '8bit', 0x0807, '!=', 'Value', '', 0])
const ResetIfNotFantasy = () => $(['ResetIf', 'Mem', '8bit', 0x0807, '!=', 'Value', '', 1])
const ResetIfWhiteClockAbove = (minutes) => $(['ResetIf', 'Mem', '8bit', 0x00e6, '>', 'Value', '', minutes])

const HalfMovesPlayed = (cmp, val) => $(['', 'Mem', '8bit', 0x1456, cmp, 'Value', '', val])

const GameWon = (playerId, flag = '') => $([flag, 'Mem', '8bit', 0x0811, '=', 'Value', '', 1], ['', 'Delta', '8bit', 0x0812, '=', 'Value', '', 0], [flag, 'Mem', '8bit', 0x0812, '=', 'Value', '', playerId == 0 ? 7 : 6])

set.addAchievement({
  id: 116318,
  badge: '127964',
  title: 'Learning the Fundamentals',
  description: 'Win a game as the white pieces, achievements will be disabled if switching sides or taking back moves',
  points: 1,
  type: 'win_condition',
  conditions: $(StartGameCheckpoint(), GameWon(0), ResetIfNotWhite(), ResetIfGameManipulated()),
})

set.addAchievement({
  id: 116319,
  badge: '127967',
  title: 'Gambit Declined',
  description: 'Win a game as the black pieces',
  points: 1,
  type: 'win_condition',
  conditions: $(StartGameCheckpoint(), GameWon(1), ResetIfNotBlack(), ResetIfGameManipulated()),
})

set.addAchievement({
  id: 116320,
  badge: '127073',
  title: 'Who Needs Time Control?',
  description: 'Win as the black pieces in less than 40 turns on at least level 4',
  points: 3,
  conditions: $(StartGameCheckpoint(), GameWon(1, 'Trigger'), HalfMovesPlayed('<', 79), ResetIfNotBlack(), ResetIfMoveWithLevelBelow(5), ResetIfGameManipulated()),
})

set.addAchievement({
  id: 116321,
  badge: '127069',
  title: 'Sorry About That',
  description: 'Win as the black pieces in 3D mode on at least level 2',
  points: 2,
  conditions: $(StartGameCheckpoint(), GameWon(1), ResetIfNotBlack(), ResetIfNot3D(), ResetIfMoveWithLevelBelow(3), ResetIfGameManipulated()),
})

set.addAchievement({
  id: 116322,
  badge: '127071',
  title: 'Another Day at the Office',
  description: 'Win as the white pieces in 2D mode on at least level 12',
  points: 5,
  conditions: $(StartGameCheckpoint(), GameWon(0), ResetIfNotWhite(), ResetIfNot2D(), ResetIfMoveWithLevelBelow(13), ResetIfGameManipulated()),
})

set.addAchievement({
  id: 116323,
  badge: '127063',
  title: `Commentator's Mode`,
  description: `Win as the black pieces in "War Room" mode on at least level 6`,
  points: 3,
  conditions: $(StartGameCheckpoint(), GameWon(1), ResetIfNotBlack(), ResetIfNotWarRoom(), ResetIfMoveWithLevelBelow(7), ResetIfGameManipulated()),
})

set.addAchievement({
  id: 116324,
  badge: '127072',
  title: 'Classic Showdown',
  description: 'Win as the white pieces on at least level 11',
  points: 4,
  conditions: $(StartGameCheckpoint(), GameWon(0), ResetIfNotWhite(), ResetIfMoveWithLevelBelow(12), ResetIfGameManipulated()),
})

set.addAchievement({
  id: 116325,
  badge: '127062',
  title: 'Chess Fantasy',
  description: `Win as the black pieces in the "Fantasy" style on at least level 8`,
  points: 3,
  conditions: $(StartGameCheckpoint(), GameWon(1), ResetIfNotBlack(), ResetIfNotFantasy(), ResetIfMoveWithLevelBelow(9), ResetIfGameManipulated()),
})

set.addAchievement({
  id: 116326,
  badge: '127060',
  title: 'Old School',
  description: `Win as the black pieces in the "Staunton" style at level infinite`,
  points: 5,
  conditions: $(StartGameCheckpoint(), GameWon(1), ResetIfNotBlack(), ResetIfNotStaunton(), ResetIfMoveWithLevelBelow(15), ResetIfGameManipulated()),
})

set.addAchievement({
  id: 116327,
  badge: '127067',
  title: 'Blitzing My Way to a Win',
  description: 'Win as the white pieces in less than 10 minutes on at least level 3',
  points: 3,
  conditions: $(StartGameCheckpoint(), GameWon(0), ResetIfNotWhite(), ResetIfWhiteClockAbove(9), ResetIfMoveWithLevelBelow(4), ResetIfGameManipulated()),
})

export default set