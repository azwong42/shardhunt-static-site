// Adapted from an original python port of https://github.com/keiwando/libraryofbabel3D/blob/master/Assets/Scripts/Libraries/OfflineLibrary.cs

const relativeLocationOffset = 10n ** 24n

// Setup LCG
const min_m = 29n ** 3200n
const a_minus_1 = min_m / 2n
const m = 4n * a_minus_1
const a = a_minus_1 + 1n
const c = ((2n ** 11213n) - 1n) * ((2n ** 4253n) - 1n) * 2305843009213693951n * 8191n * 13n
const a_inv = EuclidExtendedSolution.extended_gcd(a, m).x
const page_lcg_calculator = new LcgCalculator(m, a, c, a_inv)

// We can't touch the first 5 bits in order to guarantee that the input of the LCG is always < m
const page_bit_flipper = new BitFlipper(15546n, 5n, 40n)  // 2^15545 < 29^3200 < 2^15546

const english_words_lower_alpha_list = englishAll;


function floor_transform(floor) {
    return BigInt(floor) * 17n;
}

function get_rel_loc(floor, page, volume, shelf, wall) {
    const adj_page = ((BigInt(page) + floor_transform(floor)) % 410n) * 10000n;
    const adj_volume = ((BigInt(volume) + floor_transform(floor)) % 32n) * 100n;
    const adj_shelf = ((BigInt(shelf) + floor_transform(floor)) % 5n) * 10n;
    const adj_wall = ((BigInt(wall) + floor_transform(floor)) % 4n);
    return adj_page + adj_volume + adj_shelf + adj_wall;
}

function page_at_location(loc) {
    let abs_loc = (loc.hex + floor_transform(loc.floor)) + relativeLocationOffset * get_rel_loc(loc.floor, loc.page, loc.volume, loc.shelf, loc.wall);
    abs_loc = abs_loc % page_lcg_calculator.m;
    return new Page(loc, '', text_at_abs_loc(abs_loc));
}

function text_at_abs_loc(loc) {
    // Flip some of the first and last of the location bits
    // so that consecutive rooms lead to bigger differences in book contents
    const flipped_loc = page_bit_flipper.flip_bits(loc);
    const y = page_lcg_calculator.calc(flipped_loc);
    const contents = pad_before(num_to_string(y, ALPHABET), ' ', 3201).slice(1, 3201);
    return contents.slice(414, 3200) + contents.slice(0, 414);
}

function abs_loc_of_text(page_text) {
    const contents = page_text.slice(3200 - 414, 3200) + page_text.slice(0, 3200 - 414);
    const y = string_to_num(contents, ALPHABET);
    const flipped_loc = page_lcg_calculator.inv(y);
    return page_bit_flipper.inv_flip_bits(flipped_loc);
}

function overlay(text, search_text) {
    const start = randInt(3200 - search_text.length);
    const text_list = [...text];
    const search_text_list = [...search_text];
    for (let i = start; i < start + search_text.length; i++) {
        text_list[i] = search_text_list[i - start];
    }
    return text_list.join('');
}

function find_all(s, ch) {
    const ret = [];
    for (let i = 0; i < s.length; i++) {
        if (s[i] === ch) {
            ret.push(i);
        }
    }
    return ret;
}

function arrayShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generate_space() {
    const req = [
        ' ,backslashs,final,backslashs,backslashs,',
        'backslashs, ,frontier,backslashs,backslashs,',
        'backslashs,backslashs,tv, ,backslashs,',
        'backslashs,backslashs,show,backslashs, ,'
    ];
    const options = [' ', 'backslashs', 'backslashs', 'backslashs', 'ENGLISH_WORD'];
    arrayShuffle(req);
    let text = '$' + req.join('$$') + '$';
    const pattern = /(?=\s,backslashs,[a-z]*,backslashs,backslashs,|backslashs,\s,[a-z]*,backslashs,backslashs,|backslashs,backslashs,[a-z]*,\s,backslashs,|backslashs,backslashs,[a-z]*,backslashs,\s,|\s,\s,[a-z]*,\s,\s,)/g
    while (text.replaceAll(/\$/g, '').length < 3029) {
        const allSymbols = find_all(text, '$');
        const insertion = allSymbols[randInt(allSymbols.length)];
        let temp = text.slice(0, insertion + 1) + options[randInt(options.length)] + ',$' + text.slice(insertion + 1);
        temp = temp.replaceAll(/ENGLISH_WORD/g, () => { return english_words_lower_alpha_list[randInt(english_words_lower_alpha_list.length)]; });
        const test_temp = temp.replaceAll(/\$/g, '');
        if (test_temp.length < 3040 && [...(test_temp.matchAll(pattern))].length === 4) {
            text = temp;
        }
    }
    return text.replaceAll(/\$/g, '');
}

function custom_pad(text, i) {
    let caesar = '';
    let puzzle_content = '';
    switch(i) {
        case 0:
            caesar = 'dont forget items';
            puzzle_content = pad_random('odlaw ambulance school car pedestriancrossing hospital mechanic gasstation pickuptruck porter hotel bookstore binoculars policemen barbershop restaurant waiter wine fountain leash statue flattire windowwasher pigeons manholecover cyclist  cruiseliner sailboat waves swimmers watcher volleyball raft ferry shovels horses sand cacti tents umbrellas towel beachball icecream bobble sandcastle sunburn sunscreen purse humanpyramid dog runners puppetshow  hawk chairlift bone avalanche pinetree bobsledders ice lakes woof fishermen poles warmhats rockyoutcrops yeti snowball chimney alpinehut goggles iceskater summit flags signs gloves scarf snow parachute  wenda van trailer footpath scarecrow marathonrunners fields football punter bridge river bull matador camera tent guitarist teepee hikers santa mermaids hippies boat boyscouts periscope sharkfin bedroll  pigeons paint clock key trains traintracks fence forklift waldo grain highvisjackets suitcases bench map grafitti constructionworkers stowaways crate pickuptruck ticketstation newspaper barrel cattle smoke wheelbarrow trenchcoat  ufo rocket airtrafficcontrol zeppelin stealthaircraft hotairballoon passengerplane helicopter flags bus luggage scroll fireengine dracula wizardwhitebeard customs smuggler carousel jetfuel pilot biplane stairs elephant windsock flyingace bats', ALPHABET, 3200);
            break;
        case 1:
            caesar = 'this calls for a google';
            puzzle_content = pad_random('nine. intent lion loses head following morning shaving, eight. six. even edwin roth generates gossip, four. seven. coin from greece lacks switzerlands excitement, five. two. train, for instance, is no longer a printing device, seven. one. skip the french high school exam, four. five. description of clanging noises from weird call time, eight. three. small unit of time for plant, four. four. adjust undergarment, five. eight. meant to run crooked for competition, ten.  one of four, two of five, three of seven, four of nine. five of six, two of five, four of four, two of four, two of five.', ALPHABET, 3200);
            break;
        case 2:
            caesar = 'first, name these people';
            puzzle_content = pad_lines('molly c                                                            cranach, fivelogan                                                                durden, onebruce                                                                fabray, oneray                                                                gretzky, fivebob                                                             mccartney, threeian                                                                 newton, fiveharrison                                                           pollock, fivegeorge                                                              prefect, oneoscar                                                               thomas, fiveelton                                                                watson, twoliv                                                                      x, fivemichael                                                              xavier, six                                    four six                                    ', ALPHABET, 3200);
            break;
        case 3:
            caesar = 'weve been working on these titles';
            puzzle_content = pad_random('cold season lasting a century, three seven four six, fortynine. hazardous twenty four hour periods, nine four, one. frozen water makes up a celestial body, six three, seven. doctor who companion williams has his initial smooch , five five four, nine. sequel to starfleets noninterference policy, five nine one, ten. circus performers are unable to rest, six four five, eight. the methodology by which the sun and and the planets were attained through victory, three three five six three three, six. disturbance at the road near central park tower, eight two four six, twentytwo. californian city hosts a celebration, five two six, three. damage to food from excessive time in the icebox, eleven, six. reaping of cyanococcus or hopi maize, perhaps, four seven, two. slogan for those awaiting mortality and chasing renown, four five three five, nine.', ALPHABET, 3200);
            break;
        case 4:
            caesar = 'worm search';
            puzzle_content = pad_lines(pad_randoms(['                 ', ' senbridgecfmvdd ', ' pendicularityby ', ' yyldnavigatoroq ', ' hactesswftnwioz ', ' qpupeiemirtuntj ', ' ueshthiapnsbghq ', ' grcowrnveedhnsf ', ' utlnopserjreeas ', ' iueerltsyoapnje ', ' lrkbkfeyotbgjcr ', ' zenzuhisssubtla ', ' bsiylmntwjlybnc ', ' qcfqmbreargatet ', ' tyefnvomfegbrbw ', ' kxjxtlsxcienced ', '                 ', ' eight five six  ', ' sixteen         ', ' six four six    ', ' eight seven     ', ' four seven      ', ' five five       ', ' eight           ', ' six five        ', ' five nine       ', ' nine            '], ALPHABET, 80).join(""), ALPHABET, 3200);
            break;
        case 5:
            caesar = 'one space at a time';
            puzzle_content = pad_random(generate_space(), ' ', 3040) + (' '.repeat(80) + '   backslashs,backslashs,bracketahyphenzbracketasterisk,backslashs,backslashs   ');
            break;
        case 6:
            caesar = 'search your library';
            puzzle_content = pad_random('fourubaer twoggpowertwotoughnesstwocns fourggchrisrallis fourrwloyaltyfour sixbbbpowersixtoughnessfive fourggelementalhou tworrggflying ggraremattstewart ggddr twocommonequipmentfranzvohwinkel sixbbbpowersixtoughnessfive onercommonauraori fouruwzackstella', ALPHABET, 3200)
            break;
    }
    const search_text = text + caesar;
    return {
        'search': search_text,
        'overlay': overlay(puzzle_content, search_text)
    }
}

function extraction_bigram(text, bi) {
    return {
        'search': text,
        'overlay': overlay(bi.repeat(1600), text)
    }
}

function minBigInt(a, b) {
    return a < b ? a : b;
}

function search(floor, text, i) {
    text = text.toLowerCase();
    let info = {};
    let search_text;
    let padded_text;
    if (floor !== 2 || i === -1) {
        search_text = text;
        padded_text = pad_random(text, ALPHABET, 3200);
    } else {
        if (text === 'a superstar' || text === 'asuperstar') {
            info = extraction_bigram(text, 'tr');
        } else if (text === 'everything') {
            info = extraction_bigram(text, 'ai')
        } else if (text === 'tomorrow') {
            info = extraction_bigram(text, 'ne')
        } else if (text === 'extraterrestrial intelligence' || text === 'extraterrestrialintelligence' || text === 'extra terrestrial intelligence') {
            info = extraction_bigram(text, 'dh');
        } else if (text === 'more money' || text === 'moremoney') {
            info = extraction_bigram(text, 'us');
        } else if (text === 'spock') {
            info = extraction_bigram(text, 'ki');
        } else if (text === 'azcanta') {
            info = extraction_bigram(text, 'es');
        } else if (text === 'senna') {
            info = {
                'search': text,
                'overlay': overlay(3200 * 't', text)
            };
        } else {
            info = custom_pad(text, i);
        }
        search_text = info['search'];
        padded_text = info['overlay'];
    }
    const abs_loc = abs_loc_of_text(padded_text);

    // Extract the segment(s) in the absolute location that contain the relative location information
    const relative_segment = (abs_loc % (relativeLocationOffset * 10000000n)) / relativeLocationOffset;
    const page_segment = relative_segment / 10000n;
    const volume_segment = (relative_segment % 100000n) / 100n
    const shelf_segment = (relative_segment % 100n) / 10n
    const wall_segment = relative_segment % 10n

    // Extract the possible range of wall, shelf, book and page numbers
    const max_page = minBigInt(409n, page_segment);
    const max_volume = minBigInt(31n, volume_segment);
    const max_shelf = minBigInt(4n, shelf_segment);
    const max_wall = minBigInt(3n, wall_segment);

    // Pick a random relative location within the given limits
    const page = randInt(Number(max_page));
    const volume = randInt(Number(max_volume));
    const shelf = randInt(Number(max_shelf));
    const wall = randInt(Number(max_wall));

    // Reconstruct the hexagon location
    const rel_loc = get_rel_loc(floor, page, volume, shelf, wall);
    const hex_loc = (abs_loc - relativeLocationOffset * rel_loc) - floor_transform(floor);

    return new Page(
        new Location(
            floor,
            num_to_string(hex_loc, ADDRESS_CHAR_SET),
            wall,
            shelf,
            volume,
            page
        ), search_text, padded_text
    );
}

function search_by_request(request) {
    const ret = {}
    for (let i = 0; i < 7; i++) {
        const result = search(request['floor'], request['search'], i);
        ret[i] = {
            'text': result.text,
            'search': result.search,
            'floor': result.loc.floor,
            'hex': result.loc.hex,
            'wall': result.loc.wall,
            'shelf': result.loc.shelf,
            'volume': result.loc.volume,
            'page': result.loc.page
        };
    }
    return ret;
}

function page_at_full_address(request) {
    const loc = new Location(
        request['floor'],
        string_to_num(request['hex'], ADDRESS_CHAR_SET),
        request['wall'],
        request['shelf'],
        request['volume'],
        request['page']
    )
    const page = page_at_location(loc);
    return {
        'text': page.text
    }
}