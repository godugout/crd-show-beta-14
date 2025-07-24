import { TeamPalette, createTeamPalette } from './teamPalettes';

// Professional Sports Team Themes
export const mlbTeams: TeamPalette[] = [
  // American League East (first 4)
  createTeamPalette('yankees', 'Yankees', 'Classic Navy & Pinstripe', '#132448', '#FFFFFF', '#C4CED4', '#F8F9FA'),
  createTeamPalette('red-sox', 'Red Sox', 'Red & Navy', '#BD3039', '#0C2340', '#FFFFFF', '#F5F5F5'),
  createTeamPalette('orioles', 'Orioles', 'Orange & Black', '#DF4601', '#000000', '#FFFFFF', '#F8F8F8'),
  createTeamPalette('blue-jays', 'Blue Jays', 'Royal Blue & Red', '#134A8E', '#E8291C', '#FFFFFF', '#F7F7F7'),
];

export const nbaTeams: TeamPalette[] = [
  // Eastern Conference - Atlantic (first 4)
  createTeamPalette('celtics', 'Celtics', 'Green & Gold', '#007A33', '#BA9653', '#FFFFFF', '#F7F7F7'),
  createTeamPalette('nets', 'Nets', 'Black & White', '#000000', '#FFFFFF', '#777D84', '#F9F9F9'),
  createTeamPalette('knicks', 'Knicks', 'Blue & Orange', '#006BB6', '#F58426', '#FFFFFF', '#F8F8F8'),
  createTeamPalette('sixers', '76ers', 'Blue & Red', '#006BB6', '#ED174C', '#FFFFFF', '#F5F5F5'),
];

export const nflTeams: TeamPalette[] = [
  // AFC East (first 4)
  createTeamPalette('bills', 'Bills', 'Blue & Red', '#00338D', '#C60C30', '#FFFFFF', '#F8F8F8'),
  createTeamPalette('dolphins', 'Dolphins', 'Aqua & Orange', '#008E97', '#FC4C02', '#005778', '#F5F5F5'),
  createTeamPalette('patriots', 'Patriots', 'Navy & Red', '#002244', '#C60C30', '#B0B7BC', '#F7F7F7'),
  createTeamPalette('jets', 'Jets', 'Green & White', '#125740', '#FFFFFF', '#000000', '#F9F9F9'),
];

export const nhlTeams: TeamPalette[] = [
  // Eastern Conference - Atlantic (first 4)
  createTeamPalette('bruins', 'Bruins', 'Black & Gold', '#FFB81C', '#000000', '#FFFFFF', '#F8F8F8'),
  createTeamPalette('sabres', 'Sabres', 'Navy & Gold', '#003087', '#FFB81C', '#FFFFFF', '#F5F5F5'),
  createTeamPalette('red-wings', 'Red Wings', 'Red & White', '#CE1126', '#FFFFFF', '#000000', '#F7F7F7'),
  createTeamPalette('panthers-nhl', 'Panthers', 'Red & Navy', '#041E42', '#C8102E', '#B9975B', '#F9F9F9'),
];

export const allProfessionalSportsTeams: TeamPalette[] = [
  ...mlbTeams,
  ...nbaTeams,
  ...nflTeams,
  ...nhlTeams
];