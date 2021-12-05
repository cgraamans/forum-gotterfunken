-- --------------------------------------------------------
-- Host:                         pluto
-- Server version:               10.1.48-MariaDB-0+deb9u1 - Raspbian 9.11
-- Server OS:                    debian-linux-gnueabihf
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table euspider.data.countries
CREATE TABLE IF NOT EXISTS `data.countries` (
  `name` varchar(255) DEFAULT NULL,
  `capital` varchar(255) DEFAULT NULL,
  `lat` decimal(22,18) DEFAULT NULL,
  `lon` decimal(22,18) DEFAULT NULL,
  `countrycode` varchar(3) DEFAULT NULL,
  `continent` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table euspider.data.countries: ~244 rows (approximately)
/*!40000 ALTER TABLE `data.countries` DISABLE KEYS */;
REPLACE INTO `data.countries` (`name`, `capital`, `lat`, `lon`, `countrycode`, `continent`) VALUES
	('Somaliland', 'Hargeisa', 9.550000000000000000, 44.050000000000000000, '', 'Africa'),
	('South Georgia and South Sandwich Islands', 'King Edward Point', -54.283333000000000000, -36.500000000000000000, 'GS', 'Antarctica'),
	('French Southern and Antarctic Lands', 'Port-aux-Français', -49.350000000000000000, 70.216667000000000000, 'TF', 'Antarctica'),
	('Palestine', 'Jerusalem', 31.766666666666666000, 35.233333000000000000, 'PS', 'Asia'),
	('Aland Islands', 'Mariehamn', 60.116667000000000000, 19.900000000000000000, 'AX', 'Europe'),
	('Nauru', 'Yaren', -0.547700000000000000, 166.920867000000000000, 'NR', 'Australia'),
	('Saint Martin', 'Marigot', 18.073100000000000000, -63.082200000000000000, 'MF', 'North America'),
	('Tokelau', 'Atafu', -9.166667000000000000, -171.833333000000000000, 'TK', 'Australia'),
	('Western Sahara', 'El-Aaiún', 27.153611000000000000, -13.203333000000000000, 'EH', 'Africa'),
	('Afghanistan', 'Kabul', 34.516666666666666000, 69.183333000000000000, 'AF', 'Asia'),
	('Albania', 'Tirana', 41.316666666666670000, 19.816667000000000000, 'AL', 'Europe'),
	('Algeria', 'Algiers', 36.750000000000000000, 3.050000000000000000, 'DZ', 'Africa'),
	('American Samoa', 'Pago Pago', -14.266666666666667000, -170.700000000000000000, 'AS', 'Australia'),
	('Andorra', 'Andorra la Vella', 42.500000000000000000, 1.516667000000000000, 'AD', 'Europe'),
	('Angola', 'Luanda', -8.833333333333334000, 13.216667000000000000, 'AO', 'Africa'),
	('Anguilla', 'The Valley', 18.216666666666665000, -63.050000000000000000, 'AI', 'North America'),
	('Antigua and Barbuda', 'Saint John\'s', 17.116666666666667000, -61.850000000000000000, 'AG', 'North America'),
	('Argentina', 'Buenos Aires', -34.583333333333336000, -58.666667000000000000, 'AR', 'South America'),
	('Armenia', 'Yerevan', 40.166666666666664000, 44.500000000000000000, 'AM', 'Europe'),
	('Aruba', 'Oranjestad', 12.516666666666667000, -70.033333000000000000, 'AW', 'North America'),
	('Australia', 'Canberra', -35.266666666666666000, 149.133333000000000000, 'AU', 'Australia'),
	('Austria', 'Vienna', 48.200000000000000000, 16.366667000000000000, 'AT', 'Europe'),
	('Azerbaijan', 'Baku', 40.383333333333330000, 49.866667000000000000, 'AZ', 'Europe'),
	('Bahamas', 'Nassau', 25.083333333333332000, -77.350000000000000000, 'BS', 'North America'),
	('Bahrain', 'Manama', 26.233333333333334000, 50.566667000000000000, 'BH', 'Asia'),
	('Bangladesh', 'Dhaka', 23.716666666666665000, 90.400000000000000000, 'BD', 'Asia'),
	('Barbados', 'Bridgetown', 13.100000000000000000, -59.616667000000000000, 'BB', 'North America'),
	('Belarus', 'Minsk', 53.900000000000000000, 27.566667000000000000, 'BY', 'Europe'),
	('Belgium', 'Brussels', 50.833333333333336000, 4.333333000000000000, 'BE', 'Europe'),
	('Belize', 'Belmopan', 17.250000000000000000, -88.766667000000000000, 'BZ', 'Central America'),
	('Benin', 'Porto-Novo', 6.483333333333333000, 2.616667000000000000, 'BJ', 'Africa'),
	('Bermuda', 'Hamilton', 32.283333333333330000, -64.783333000000000000, 'BM', 'North America'),
	('Bhutan', 'Thimphu', 27.466666666666665000, 89.633333000000000000, 'BT', 'Asia'),
	('Bolivia', 'La Paz', -16.500000000000000000, -68.150000000000000000, 'BO', 'South America'),
	('Bosnia and Herzegovina', 'Sarajevo', 43.866666666666670000, 18.416667000000000000, 'BA', 'Europe'),
	('Botswana', 'Gaborone', -24.633333333333333000, 25.900000000000000000, 'BW', 'Africa'),
	('Brazil', 'Brasilia', -15.783333333333333000, -47.916667000000000000, 'BR', 'South America'),
	('British Virgin Islands', 'Road Town', 18.416666666666668000, -64.616667000000000000, 'VG', 'North America'),
	('Brunei Darussalam', 'Bandar Seri Begawan', 4.883333333333333000, 114.933333000000000000, 'BN', 'Asia'),
	('Bulgaria', 'Sofia', 42.683333333333330000, 23.316667000000000000, 'BG', 'Europe'),
	('Burkina Faso', 'Ouagadougou', 12.366666666666667000, -1.516667000000000000, 'BF', 'Africa'),
	('Myanmar', 'Rangoon', 16.800000000000000000, 96.150000000000000000, 'MM', 'Asia'),
	('Burundi', 'Bujumbura', -3.366666666666666700, 29.350000000000000000, 'BI', 'Africa'),
	('Cambodia', 'Phnom Penh', 11.550000000000000000, 104.916667000000000000, 'KH', 'Asia'),
	('Cameroon', 'Yaounde', 3.866666666666666700, 11.516667000000000000, 'CM', 'Africa'),
	('Canada', 'Ottawa', 45.416666666666664000, -75.700000000000000000, 'CA', 'Central America'),
	('Cape Verde', 'Praia', 14.916666666666666000, -23.516667000000000000, 'CV', 'Africa'),
	('Cayman Islands', 'George Town', 19.300000000000000000, -81.383333000000000000, 'KY', 'North America'),
	('Central African Republic', 'Bangui', 4.366666666666666000, 18.583333000000000000, 'CF', 'Africa'),
	('Chad', 'N\'Djamena', 12.100000000000000000, 15.033333000000000000, 'TD', 'Africa'),
	('Chile', 'Santiago', -33.450000000000000000, -70.666667000000000000, 'CL', 'South America'),
	('China', 'Beijing', 39.916666666666664000, 116.383333000000000000, 'CN', 'Asia'),
	('Christmas Island', 'The Settlement', -10.416666666666666000, 105.716667000000000000, 'CX', 'Australia'),
	('Cocos Islands', 'West Island', -12.166666666666666000, 96.833333000000000000, 'CC', 'Australia'),
	('Colombia', 'Bogota', 4.600000000000000000, -74.083333000000000000, 'CO', 'South America'),
	('Comoros', 'Moroni', -11.700000000000000000, 43.233333000000000000, 'KM', 'Africa'),
	('Democratic Republic of the Congo', 'Kinshasa', -4.316666666666666000, 15.300000000000000000, 'CD', 'Africa'),
	('Republic of Congo', 'Brazzaville', -4.250000000000000000, 15.283333000000000000, 'CG', 'Africa'),
	('Cook Islands', 'Avarua', -21.200000000000000000, -159.766667000000000000, 'CK', 'Australia'),
	('Costa Rica', 'San Jose', 9.933333333333334000, -84.083333000000000000, 'CR', 'Central America'),
	('Cote d\'Ivoire', 'Yamoussoukro', 6.816666666666666000, -5.266667000000000000, 'CI', 'Africa'),
	('Croatia', 'Zagreb', 45.800000000000000000, 16.000000000000000000, 'HR', 'Europe'),
	('Cuba', 'Havana', 23.116666666666667000, -82.350000000000000000, 'CU', 'North America'),
	('Curaçao', 'Willemstad', 12.100000000000000000, -68.916667000000000000, 'CW', 'North America'),
	('Cyprus', 'Nicosia', 35.166666666666664000, 33.366667000000000000, 'CY', 'Europe'),
	('Czech Republic', 'Prague', 50.083333333333336000, 14.466667000000000000, 'CZ', 'Europe'),
	('Denmark', 'Copenhagen', 55.666666666666664000, 12.583333000000000000, 'DK', 'Europe'),
	('Djibouti', 'Djibouti', 11.583333333333334000, 43.150000000000000000, 'DJ', 'Africa'),
	('Dominica', 'Roseau', 15.300000000000000000, -61.400000000000000000, 'DM', 'North America'),
	('Dominican Republic', 'Santo Domingo', 18.466666666666665000, -69.900000000000000000, 'DO', 'North America'),
	('Ecuador', 'Quito', -0.216666666666666670, -78.500000000000000000, 'EC', 'South America'),
	('Egypt', 'Cairo', 30.050000000000000000, 31.250000000000000000, 'EG', 'Africa'),
	('El Salvador', 'San Salvador', 13.700000000000000000, -89.200000000000000000, 'SV', 'Central America'),
	('Equatorial Guinea', 'Malabo', 3.750000000000000000, 8.783333000000000000, 'GQ', 'Africa'),
	('Eritrea', 'Asmara', 15.333333333333334000, 38.933333000000000000, 'ER', 'Africa'),
	('Estonia', 'Tallinn', 59.433333333333330000, 24.716667000000000000, 'EE', 'Europe'),
	('Ethiopia', 'Addis Ababa', 9.033333333333333000, 38.700000000000000000, 'ET', 'Africa'),
	('Falkland Islands', 'Stanley', -51.700000000000000000, -57.850000000000000000, 'FK', 'South America'),
	('Faroe Islands', 'Torshavn', 62.000000000000000000, -6.766667000000000000, 'FO', 'Europe'),
	('Fiji', 'Suva', -18.133333333333333000, 178.416667000000000000, 'FJ', 'Australia'),
	('Finland', 'Helsinki', 60.166666666666664000, 24.933333000000000000, 'FI', 'Europe'),
	('France', 'Paris', 48.866666666666670000, 2.333333000000000000, 'FR', 'Europe'),
	('French Polynesia', 'Papeete', -17.533333333333335000, -149.566667000000000000, 'PF', 'Australia'),
	('Gabon', 'Libreville', 0.383333333333333360, 9.450000000000000000, 'GA', 'Africa'),
	('The Gambia', 'Banjul', 13.450000000000000000, -16.566667000000000000, 'GM', 'Africa'),
	('Georgia', 'Tbilisi', 41.683333333333330000, 44.833333000000000000, 'GE', 'Europe'),
	('Germany', 'Berlin', 52.516666666666666000, 13.400000000000000000, 'DE', 'Europe'),
	('Ghana', 'Accra', 5.550000000000000000, -0.216667000000000000, 'GH', 'Africa'),
	('Gibraltar', 'Gibraltar', 36.133333333333330000, -5.350000000000000000, 'GI', 'Europe'),
	('Greece', 'Athens', 37.983333333333334000, 23.733333000000000000, 'GR', 'Europe'),
	('Greenland', 'Nuuk', 64.183333333333340000, -51.750000000000000000, 'GL', 'Central America'),
	('Grenada', 'Saint George\'s', 12.050000000000000000, -61.750000000000000000, 'GD', 'North America'),
	('Guam', 'Hagatna', 13.466666666666667000, 144.733333000000000000, 'GU', 'Australia'),
	('Guatemala', 'Guatemala City', 14.616666666666667000, -90.516667000000000000, 'GT', 'Central America'),
	('Guernsey', 'Saint Peter Port', 49.450000000000000000, -2.533333000000000000, 'GG', 'Europe'),
	('Guinea', 'Conakry', 9.500000000000000000, -13.700000000000000000, 'GN', 'Africa'),
	('Guinea-Bissau', 'Bissau', 11.850000000000000000, -15.583333000000000000, 'GW', 'Africa'),
	('Guyana', 'Georgetown', 6.800000000000000000, -58.150000000000000000, 'GY', 'South America'),
	('Haiti', 'Port-au-Prince', 18.533333333333335000, -72.333333000000000000, 'HT', 'North America'),
	('Vatican City', 'Vatican City', 41.900000000000000000, 12.450000000000000000, 'VA', 'Europe'),
	('Honduras', 'Tegucigalpa', 14.100000000000000000, -87.216667000000000000, 'HN', 'Central America'),
	('Hungary', 'Budapest', 47.500000000000000000, 19.083333000000000000, 'HU', 'Europe'),
	('Iceland', 'Reykjavik', 64.150000000000000000, -21.950000000000000000, 'IS', 'Europe'),
	('India', 'New Delhi', 28.600000000000000000, 77.200000000000000000, 'IN', 'Asia'),
	('Indonesia', 'Jakarta', -6.166666666666667000, 106.816667000000000000, 'ID', 'Asia'),
	('Iran', 'Tehran', 35.700000000000000000, 51.416667000000000000, 'IR', 'Asia'),
	('Iraq', 'Baghdad', 33.333333333333336000, 44.400000000000000000, 'IQ', 'Asia'),
	('Ireland', 'Dublin', 53.316666666666670000, -6.233333000000000000, 'IE', 'Europe'),
	('Isle of Man', 'Douglas', 54.150000000000000000, -4.483333000000000000, 'IM', 'Europe'),
	('Israel', 'Jerusalem', 31.766666666666666000, 35.233333000000000000, 'IL', 'Asia'),
	('Italy', 'Rome', 41.900000000000000000, 12.483333000000000000, 'IT', 'Europe'),
	('Jamaica', 'Kingston', 18.000000000000000000, -76.800000000000000000, 'JM', 'North America'),
	('Japan', 'Tokyo', 35.683333333333330000, 139.750000000000000000, 'JP', 'Asia'),
	('Jersey', 'Saint Helier', 49.183333333333330000, -2.100000000000000000, 'JE', 'Europe'),
	('Jordan', 'Amman', 31.950000000000000000, 35.933333000000000000, 'JO', 'Asia'),
	('Kazakhstan', 'Astana', 51.166666666666664000, 71.416667000000000000, 'KZ', 'Asia'),
	('Kenya', 'Nairobi', -1.283333333333333200, 36.816667000000000000, 'KE', 'Africa'),
	('Kiribati', 'Tarawa', -0.883333333333333300, 169.533333000000000000, 'KI', 'Australia'),
	('North Korea', 'Pyongyang', 39.016666666666666000, 125.750000000000000000, 'KP', 'Asia'),
	('South Korea', 'Seoul', 37.550000000000000000, 126.983333000000000000, 'KR', 'Asia'),
	('Kosovo', 'Pristina', 42.666666666666664000, 21.166667000000000000, 'KO', 'Europe'),
	('Kuwait', 'Kuwait City', 29.366666666666667000, 47.966667000000000000, 'KW', 'Asia'),
	('Kyrgyzstan', 'Bishkek', 42.866666666666670000, 74.600000000000000000, 'KG', 'Asia'),
	('Laos', 'Vientiane', 17.966666666666665000, 102.600000000000000000, 'LA', 'Asia'),
	('Latvia', 'Riga', 56.950000000000000000, 24.100000000000000000, 'LV', 'Europe'),
	('Lebanon', 'Beirut', 33.866666666666670000, 35.500000000000000000, 'LB', 'Asia'),
	('Lesotho', 'Maseru', -29.316666666666666000, 27.483333000000000000, 'LS', 'Africa'),
	('Liberia', 'Monrovia', 6.300000000000000000, -10.800000000000000000, 'LR', 'Africa'),
	('Libya', 'Tripoli', 32.883333333333330000, 13.166667000000000000, 'LY', 'Africa'),
	('Liechtenstein', 'Vaduz', 47.133333333333330000, 9.516667000000000000, 'LI', 'Europe'),
	('Lithuania', 'Vilnius', 54.683333333333330000, 25.316667000000000000, 'LT', 'Europe'),
	('Luxembourg', 'Luxembourg', 49.600000000000000000, 6.116667000000000000, 'LU', 'Europe'),
	('Macedonia', 'Skopje', 42.000000000000000000, 21.433333000000000000, 'MK', 'Europe'),
	('Madagascar', 'Antananarivo', -18.916666666666668000, 47.516667000000000000, 'MG', 'Africa'),
	('Malawi', 'Lilongwe', -13.966666666666667000, 33.783333000000000000, 'MW', 'Africa'),
	('Malaysia', 'Kuala Lumpur', 3.166666666666666500, 101.700000000000000000, 'MY', 'Asia'),
	('Maldives', 'Male', 4.166666666666667000, 73.500000000000000000, 'MV', 'Asia'),
	('Mali', 'Bamako', 12.650000000000000000, -8.000000000000000000, 'ML', 'Africa'),
	('Malta', 'Valletta', 35.883333333333330000, 14.500000000000000000, 'MT', 'Europe'),
	('Marshall Islands', 'Majuro', 7.100000000000000000, 171.383333000000000000, 'MH', 'Australia'),
	('Mauritania', 'Nouakchott', 18.066666666666666000, -15.966667000000000000, 'MR', 'Africa'),
	('Mauritius', 'Port Louis', -20.150000000000000000, 57.483333000000000000, 'MU', 'Africa'),
	('Mexico', 'Mexico City', 19.433333333333334000, -99.133333000000000000, 'MX', 'Central America'),
	('Federated States of Micronesia', 'Palikir', 6.916666666666667000, 158.150000000000000000, 'FM', 'Australia'),
	('Moldova', 'Chisinau', 47.000000000000000000, 28.850000000000000000, 'MD', 'Europe'),
	('Monaco', 'Monaco', 43.733333333333334000, 7.416667000000000000, 'MC', 'Europe'),
	('Mongolia', 'Ulaanbaatar', 47.916666666666664000, 106.916667000000000000, 'MN', 'Asia'),
	('Montenegro', 'Podgorica', 42.433333333333330000, 19.266667000000000000, 'ME', 'Europe'),
	('Montserrat', 'Plymouth', 16.700000000000000000, -62.216667000000000000, 'MS', 'North America'),
	('Morocco', 'Rabat', 34.016666666666666000, -6.816667000000000000, 'MA', 'Africa'),
	('Mozambique', 'Maputo', -25.950000000000000000, 32.583333000000000000, 'MZ', 'Africa'),
	('Namibia', 'Windhoek', -22.566666666666666000, 17.083333000000000000, 'NA', 'Africa'),
	('Nepal', 'Kathmandu', 27.716666666666665000, 85.316667000000000000, 'NP', 'Asia'),
	('Netherlands', 'Amsterdam', 52.350000000000000000, 4.916667000000000000, 'NL', 'Europe'),
	('New Caledonia', 'Noumea', -22.266666666666666000, 166.450000000000000000, 'NC', 'Australia'),
	('New Zealand', 'Wellington', -41.300000000000000000, 174.783333000000000000, 'NZ', 'Australia'),
	('Nicaragua', 'Managua', 12.133333333333333000, -86.250000000000000000, 'NI', 'Central America'),
	('Niger', 'Niamey', 13.516666666666667000, 2.116667000000000000, 'NE', 'Africa'),
	('Nigeria', 'Abuja', 9.083333333333334000, 7.533333000000000000, 'NG', 'Africa'),
	('Niue', 'Alofi', -19.016666666666666000, -169.916667000000000000, 'NU', 'Australia'),
	('Norfolk Island', 'Kingston', -29.050000000000000000, 167.966667000000000000, 'NF', 'Australia'),
	('Northern Mariana Islands', 'Saipan', 15.200000000000000000, 145.750000000000000000, 'MP', 'Australia'),
	('Norway', 'Oslo', 59.916666666666664000, 10.750000000000000000, 'NO', 'Europe'),
	('Oman', 'Muscat', 23.616666666666667000, 58.583333000000000000, 'OM', 'Asia'),
	('Pakistan', 'Islamabad', 33.683333333333330000, 73.050000000000000000, 'PK', 'Asia'),
	('Palau', 'Melekeok', 7.483333333333333000, 134.633333000000000000, 'PW', 'Australia'),
	('Panama', 'Panama City', 8.966666666666667000, -79.533333000000000000, 'PA', 'Central America'),
	('Papua New Guinea', 'Port Moresby', -9.450000000000000000, 147.183333000000000000, 'PG', 'Australia'),
	('Paraguay', 'Asuncion', -25.266666666666666000, -57.666667000000000000, 'PY', 'South America'),
	('Peru', 'Lima', -12.050000000000000000, -77.050000000000000000, 'PE', 'South America'),
	('Philippines', 'Manila', 14.600000000000000000, 120.966667000000000000, 'PH', 'Asia'),
	('Pitcairn Islands', 'Adamstown', -25.066666666666666000, -130.083333000000000000, 'PN', 'Australia'),
	('Poland', 'Warsaw', 52.250000000000000000, 21.000000000000000000, 'PL', 'Europe'),
	('Portugal', 'Lisbon', 38.716666666666670000, -9.133333000000000000, 'PT', 'Europe'),
	('Puerto Rico', 'San Juan', 18.466666666666665000, -66.116667000000000000, 'PR', 'North America'),
	('Qatar', 'Doha', 25.283333333333335000, 51.533333000000000000, 'QA', 'Asia'),
	('Romania', 'Bucharest', 44.433333333333330000, 26.100000000000000000, 'RO', 'Europe'),
	('Russia', 'Moscow', 55.750000000000000000, 37.600000000000000000, 'RU', 'Europe'),
	('Rwanda', 'Kigali', -1.950000000000000000, 30.050000000000000000, 'RW', 'Africa'),
	('Saint Barthelemy', 'Gustavia', 17.883333333333333000, -62.850000000000000000, 'BL', 'North America'),
	('Saint Helena', 'Jamestown', -15.933333333333334000, -5.716667000000000000, 'SH', 'Africa'),
	('Saint Kitts and Nevis', 'Basseterre', 17.300000000000000000, -62.716667000000000000, 'KN', 'North America'),
	('Saint Lucia', 'Castries', 14.000000000000000000, -61.000000000000000000, 'LC', 'North America'),
	('Saint Pierre and Miquelon', 'Saint-Pierre', 46.766666666666666000, -56.183333000000000000, 'PM', 'Central America'),
	('Saint Vincent and the Grenadines', 'Kingstown', 13.133333333333333000, -61.216667000000000000, 'VC', 'Central America'),
	('Samoa', 'Apia', -13.816666666666666000, -171.766667000000000000, 'WS', 'Australia'),
	('San Marino', 'San Marino', 43.933333333333330000, 12.416667000000000000, 'SM', 'Europe'),
	('Sao Tome and Principe', 'Sao Tome', 0.333333333333333300, 6.733333000000000000, 'ST', 'Africa'),
	('Saudi Arabia', 'Riyadh', 24.650000000000000000, 46.700000000000000000, 'SA', 'Asia'),
	('Senegal', 'Dakar', 14.733333333333333000, -17.633333000000000000, 'SN', 'Africa'),
	('Serbia', 'Belgrade', 44.833333333333336000, 20.500000000000000000, 'RS', 'Europe'),
	('Seychelles', 'Victoria', -4.616666666666667000, 55.450000000000000000, 'SC', 'Africa'),
	('Sierra Leone', 'Freetown', 8.483333333333333000, -13.233333000000000000, 'SL', 'Africa'),
	('Singapore', 'Singapore', 1.283333333333333200, 103.850000000000000000, 'SG', 'Asia'),
	('Sint Maarten', 'Philipsburg', 18.016666666666666000, -63.033333000000000000, 'SX', 'North America'),
	('Slovakia', 'Bratislava', 48.150000000000000000, 17.116667000000000000, 'SK', 'Europe'),
	('Slovenia', 'Ljubljana', 46.050000000000000000, 14.516667000000000000, 'SI', 'Europe'),
	('Solomon Islands', 'Honiara', -9.433333333333334000, 159.950000000000000000, 'SB', 'Australia'),
	('Somalia', 'Mogadishu', 2.066666666666667000, 45.333333000000000000, 'SO', 'Africa'),
	('South Africa', 'Pretoria', -25.700000000000000000, 28.216667000000000000, 'ZA', 'Africa'),
	('South Sudan', 'Juba', 4.850000000000000000, 31.616667000000000000, 'SS', 'Africa'),
	('Spain', 'Madrid', 40.400000000000000000, -3.683333000000000000, 'ES', 'Europe'),
	('Sri Lanka', 'Colombo', 6.916666666666667000, 79.833333000000000000, 'LK', 'Asia'),
	('Sudan', 'Khartoum', 15.600000000000000000, 32.533333000000000000, 'SD', 'Africa'),
	('Suriname', 'Paramaribo', 5.833333333333333000, -55.166667000000000000, 'SR', 'South America'),
	('Svalbard', 'Longyearbyen', 78.216666666666670000, 15.633333000000000000, 'SJ', 'Europe'),
	('Swaziland', 'Mbabane', -26.316666666666666000, 31.133333000000000000, 'SZ', 'Africa'),
	('Sweden', 'Stockholm', 59.333333333333336000, 18.050000000000000000, 'SE', 'Europe'),
	('Switzerland', 'Bern', 46.916666666666664000, 7.466667000000000000, 'CH', 'Europe'),
	('Syria', 'Damascus', 33.500000000000000000, 36.300000000000000000, 'SY', 'Asia'),
	('Taiwan', 'Taipei', 25.033333333333335000, 121.516667000000000000, 'TW', 'Asia'),
	('Tajikistan', 'Dushanbe', 38.550000000000000000, 68.766667000000000000, 'TJ', 'Asia'),
	('Tanzania', 'Dar es Salaam', -6.800000000000000000, 39.283333000000000000, 'TZ', 'Africa'),
	('Thailand', 'Bangkok', 13.750000000000000000, 100.516667000000000000, 'TH', 'Asia'),
	('Timor-Leste', 'Dili', -8.583333333333334000, 125.600000000000000000, 'TL', 'Asia'),
	('Togo', 'Lome', 6.116666666666666000, 1.216667000000000000, 'TG', 'Africa'),
	('Tonga', 'Nuku\'alofa', -21.133333333333333000, -175.200000000000000000, 'TO', 'Australia'),
	('Trinidad and Tobago', 'Port of Spain', 10.650000000000000000, -61.516667000000000000, 'TT', 'North America'),
	('Tunisia', 'Tunis', 36.800000000000000000, 10.183333000000000000, 'TN', 'Africa'),
	('Turkey', 'Ankara', 39.933333333333330000, 32.866667000000000000, 'TR', 'Europe'),
	('Turkmenistan', 'Ashgabat', 37.950000000000000000, 58.383333000000000000, 'TM', 'Asia'),
	('Turks and Caicos Islands', 'Grand Turk', 21.466666666666665000, -71.133333000000000000, 'TC', 'North America'),
	('Tuvalu', 'Funafuti', -8.516666666666667000, 179.216667000000000000, 'TV', 'Australia'),
	('Uganda', 'Kampala', 0.316666666666666650, 32.550000000000000000, 'UG', 'Africa'),
	('Ukraine', 'Kyiv', 50.433333333333330000, 30.516667000000000000, 'UA', 'Europe'),
	('United Arab Emirates', 'Abu Dhabi', 24.466666666666665000, 54.366667000000000000, 'AE', 'Asia'),
	('United Kingdom', 'London', 51.500000000000000000, -0.083333000000000000, 'GB', 'Europe'),
	('United States', 'Washington D.C.', 38.883333000000000000, -77.000000000000000000, 'US', 'Central America'),
	('Uruguay', 'Montevideo', -34.850000000000000000, -56.166667000000000000, 'UY', 'South America'),
	('Uzbekistan', 'Tashkent', 41.316666666666670000, 69.250000000000000000, 'UZ', 'Asia'),
	('Vanuatu', 'Port-Vila', -17.733333333333334000, 168.316667000000000000, 'VU', 'Australia'),
	('Venezuela', 'Caracas', 10.483333333333333000, -66.866667000000000000, 'VE', 'South America'),
	('Vietnam', 'Hanoi', 21.033333333333335000, 105.850000000000000000, 'VN', 'Asia'),
	('US Virgin Islands', 'Charlotte Amalie', 18.350000000000000000, -64.933333000000000000, 'VI', 'North America'),
	('Wallis and Futuna', 'Mata-Utu', -13.950000000000000000, -171.933333000000000000, 'WF', 'Australia'),
	('Yemen', 'Sanaa', 15.350000000000000000, 44.200000000000000000, 'YE', 'Asia'),
	('Zambia', 'Lusaka', -15.416666666666666000, 28.283333000000000000, 'ZM', 'Africa'),
	('Zimbabwe', 'Harare', -17.816666666666666000, 31.033333000000000000, 'ZW', 'Africa'),
	('US Minor Outlying Islands', 'Washington D.C.', 38.883333000000000000, -77.000000000000000000, 'UM', 'Australia'),
	('Northern Cyprus', 'North Nicosia', 35.183333000000000000, 33.366667000000000000, '', 'Europe'),
	('Hong Kong', 'N/A', 0.000000000000000000, 0.000000000000000000, 'HK', 'Asia'),
	('Heard Island and McDonald Islands', 'N/A', 0.000000000000000000, 0.000000000000000000, 'HM', 'Antarctica'),
	('British Indian Ocean Territory', 'Diego Garcia', -7.300000000000000000, 72.400000000000000000, 'IO', 'Africa'),
	('Macau', 'N/A', 0.000000000000000000, 0.000000000000000000, 'MO', 'Asia');
/*!40000 ALTER TABLE `data.countries` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
