import React, { useEffect, useState } from 'react'
import { useReducerContext } from '../ReducerProvider'

import SocketContext from './SocketContext'

const payload2 = {
    "coords": [
        51.45335515394057,
        -2.611419074566917,
        51.4539744,
        -2.6126623,
        51.4553563,
        -2.6146084,
        51.4569084,
        -2.6155762,
        51.4598802,
        -2.6173173,
        51.46256362145751,
        -2.6168007800333144,
        51.4678394,
        -2.6128039,
        51.468992,
        -2.6089819,
        51.4692685,
        -2.6077521,
        51.4693093,
        -2.6072805,
        51.46928118586493,
        -2.6047180921811632,
        51.4647889,
        -2.6056441,
        51.4626668,
        -2.6061316,
        51.4569317,
        -2.6075488,
        51.45335515394057,
        -2.611419074566917
    ],
    "pubs": [
        [
            "Dristi’s",
            51.4592495,
            -2.6111314
        ],
        [
            "Bundys",
            51.4588478,
            -2.6106816
        ],
        [
            "The Balloon",
            51.4565586,
            -2.6132752
        ],
        [
            "Steam",
            51.464551,
            -2.6118533
        ],
        [
            "Channings",
            51.4588436,
            -2.6143926
        ],
        [
            "Victoria",
            51.4596477,
            -2.6110328
        ],
        [
            "Barrel House",
            51.4563176,
            -2.6131876
        ],
        [
            "The Eldon House",
            51.4547651,
            -2.6105008
        ],
        [
            "Bar 135",
            51.46498,
            -2.6097405
        ],
        [
            "The Whitmore Tap",
            51.4643683,
            -2.6094535
        ],
        [
            "The W.G. Grace",
            51.4629398,
            -2.6087799
        ],
        [
            "Flipside",
            51.4641479,
            -2.6093529
        ],
        [
            "Bravas",
            51.4643119,
            -2.6090308
        ],
        [
            "Alterego",
            51.4630836,
            -2.6089308
        ],
        [
            "Bar Humbug",
            51.4634883,
            -2.6090085
        ],
        [
            "Brewhouse & Kitchen",
            51.4641458,
            -2.6085228
        ],
        [
            "Noto",
            51.4646727,
            -2.6100476
        ],
        [
            "Convivio",
            51.4635377,
            -2.6073331
        ],
        [
            "Crying Wolf",
            51.4639537,
            -2.6083333
        ],
        [
            "Chums",
            51.467913,
            -2.6053169
        ],
        [
            "The Good Measure",
            51.4672439,
            -2.6071252
        ],
        [
            "Vittoria",
            51.4620967,
            -2.6085036
        ],
        [
            "The Alma",
            51.4625294,
            -2.6146686
        ],
        [
            "The Lost & Found",
            51.4569781,
            -2.6086941
        ],
        [
            "Brace & Browns",
            51.4616075,
            -2.6082064
        ],
        [
            "Quinton House",
            51.457075,
            -2.6093414
        ],
        [
            "The Clyde",
            51.4687294,
            -2.6090995
        ],
        [
            "Pampam",
            51.4578471,
            -2.6081619
        ],
        [
            "Her Majesty's Secret Service",
            51.4645228,
            -2.6103836
        ],
        [
            "Shebeen",
            51.4644748,
            -2.6118349
        ]
    ],
    "selected": null
}

const payload = {
    "coords": [
        51.466342,
        -2.6113428,
        51.4681712,
        -2.6085272,
        51.4693768,
        -2.5932997,
        51.4675703,
        -2.5875225,
        51.4654595,
        -2.5825062,
        51.461628758015905,
        -2.579851305987745,
        51.4595594,
        -2.5809909,
        51.4543858,
        -2.5861701,
        51.4540439,
        -2.586549,
        51.452793,
        -2.5899323,
        51.4506627,
        -2.5965344,
        51.4507415,
        -2.5999858,
        51.4520672,
        -2.6037769,
        51.4537405,
        -2.6076049,
        51.4547705,
        -2.609877,
        51.4577074,
        -2.6132618,
        51.4580891,
        -2.6136583,
        51.4598007,
        -2.6140205,
        51.46299661826052,
        -2.6137492078354954,
        51.466342,
        -2.6113428
    ],
    "pubs": [
        [
            "Canteen",
            51.4629405,
            -2.5896689
        ],
        [
            "Dristi\u2019s",
            51.4592495,
            -2.6111314
        ],
        [
            "Bundys",
            51.4588478,
            -2.6106816
        ],
        [
            "Cast",
            51.4531018,
            -2.5981952
        ],
        [
            "Buttermilk & Maple",
            51.4532564,
            -2.592465
        ],
        [
            "Red Light",
            51.453315,
            -2.6008153
        ],
        [
            "The Papa Lounge",
            51.4560167,
            -2.5909529
        ],
        [
            "Felson's",
            51.4543291,
            -2.5941212
        ],
        [
            "Marlows",
            51.4554752,
            -2.593448
        ],
        [
            "1766 bar & kitchen",
            51.4520324,
            -2.5943082
        ],
        [
            "Mackenzies Caf\u00e9 Bar",
            51.4511763,
            -2.5981111
        ],
        [
            "Steam",
            51.464551,
            -2.6118533
        ],
        [
            "Hillgrove Porter Stores",
            51.4630516,
            -2.592569
        ],
        [
            "The Highbury Vaults",
            51.4614419,
            -2.602492
        ],
        [
            "The Bell",
            51.4623996,
            -2.5911751
        ],
        [
            "Victoria",
            51.4596477,
            -2.6110328
        ],
        [
            "The Hatchet Inn",
            51.4539004,
            -2.6005595
        ],
        [
            "The Pipe & Slippers",
            51.4646352,
            -2.5897387
        ],
        [
            "The Love Inn",
            51.4631962,
            -2.5895378
        ],
        [
            "The Crofters Rights",
            51.4638803,
            -2.5900368
        ],
        [
            "No. 51",
            51.4621994,
            -2.5903695
        ],
        [
            "The Old England",
            51.467091,
            -2.5891256
        ],
        [
            "Attic Bar",
            51.4602496,
            -2.5905198
        ],
        [
            "Full Moon",
            51.4604558,
            -2.590711
        ],
        [
            "Leftbank",
            51.4648468,
            -2.5898264
        ],
        [
            "The Green Man",
            51.4611465,
            -2.5989769
        ],
        [
            "The Kingsdown Vaults",
            51.4617262,
            -2.5966324
        ],
        [
            "The Phoenix",
            51.4584497,
            -2.5831201
        ],
        [
            "The Old Duke",
            51.4522585,
            -2.5933014
        ],
        [
            "King Street Brew House",
            51.4522298,
            -2.5928022
        ],
        [
            "The Beer Emporium",
            51.4516176,
            -2.5945048
        ],
        [
            "The Llandoger Trow",
            51.4519637,
            -2.592976
        ],
        [
            "smallBAR",
            51.4519112,
            -2.5950276
        ],
        [
            "Aluna",
            51.4520103,
            -2.5964963
        ],
        [
            "The Milk Thistle",
            51.4551184,
            -2.5957839
        ],
        [
            "Central Chambers",
            51.4547562,
            -2.5956571
        ],
        [
            "The Bristologist",
            51.4545439,
            -2.594165
        ],
        [
            "The Commercial Rooms",
            51.4544125,
            -2.5944731
        ],
        [
            "karaoke-me!",
            51.4543775,
            -2.5956415
        ],
        [
            "The Bay Horse",
            51.4576515,
            -2.5930205
        ],
        [
            "The Clockwork Rose",
            51.4536454,
            -2.5952364
        ],
        [
            "The White Hart",
            51.4585168,
            -2.5935362
        ],
        [
            "The Crown",
            51.4541911,
            -2.5929309
        ],
        [
            "Mr Wolf's",
            51.4538548,
            -2.59414
        ],
        [
            "Slug & Lettuce",
            51.4539218,
            -2.5939897
        ],
        [
            "Mugshot",
            51.4538695,
            -2.5934252
        ],
        [
            "The Boardroom",
            51.4538156,
            -2.5937176
        ],
        [
            "Walkabout",
            51.4544085,
            -2.5941278
        ],
        [
            "The Station",
            51.4573716,
            -2.5925559
        ],
        [
            "Horts",
            51.4555377,
            -2.5940856
        ],
        [
            "Faraway",
            51.4553869,
            -2.5947912
        ],
        [
            "Cat and Wheel",
            51.4687861,
            -2.592978
        ],
        [
            "Left-Handed Giant",
            51.4543898,
            -2.5895256
        ],
        [
            "Greenhouse",
            51.4524525,
            -2.5994162
        ],
        [
            "Bristol Yard",
            51.4570367,
            -2.5968368
        ],
        [
            "The Christmas Steps",
            51.4560672,
            -2.5965503
        ],
        [
            "Zero Degrees",
            51.4565067,
            -2.5978452
        ],
        [
            "The Apple",
            51.4520259,
            -2.5923378
        ],
        [
            "Colston Arms",
            51.4577586,
            -2.5983644
        ],
        [
            "The Scotchman",
            51.4575652,
            -2.5982486
        ],
        [
            "lollipop karaoke.grill.bar",
            51.4555116,
            -2.6032292
        ],
        [
            "Agora",
            51.4545974,
            -2.6030564
        ],
        [
            "The Florist",
            51.4549731,
            -2.6035414
        ],
        [
            "Bristol & Bath Rum Distillery",
            51.4555927,
            -2.6043536
        ],
        [
            "All in One",
            51.4544569,
            -2.6023274
        ],
        [
            "The Elbow Room",
            51.4549479,
            -2.6028586
        ],
        [
            "7T2",
            51.455156,
            -2.6032382
        ],
        [
            "Cotham Porter Stores",
            51.4625895,
            -2.5978212
        ],
        [
            "The Ship",
            51.4557087,
            -2.5987158
        ],
        [
            "The Beaufort",
            51.4666213,
            -2.5873956
        ],
        [
            "The Filthy Thirteen",
            51.4692988,
            -2.593146
        ],
        [
            "Be At One",
            51.4563122,
            -2.6067551
        ],
        [
            "London Cocktail Club",
            51.4566292,
            -2.6078228
        ],
        [
            "King William Ale House",
            51.4516956,
            -2.5949245
        ],
        [
            "The Famous Royal Navy Volunteer",
            51.4517282,
            -2.5947178
        ],
        [
            "Bar 135",
            51.46498,
            -2.6097405
        ],
        [
            "The Whitmore Tap",
            51.4643683,
            -2.6094535
        ],
        [
            "The W.G. Grace",
            51.4629398,
            -2.6087799
        ],
        [
            "Flipside",
            51.4641479,
            -2.6093529
        ],
        [
            "Bravas",
            51.4643119,
            -2.6090308
        ],
        [
            "Alterego",
            51.4630836,
            -2.6089308
        ],
        [
            "Bar Humbug",
            51.4634883,
            -2.6090085
        ],
        [
            "White Bear",
            51.4605827,
            -2.6015522
        ],
        [
            "Brewhouse & Kitchen",
            51.4641458,
            -2.6085228
        ],
        [
            "The Gryphon",
            51.4556349,
            -2.5976457
        ],
        [
            "The Cotham Arms",
            51.4611143,
            -2.6024827
        ],
        [
            "All Stars",
            51.455577,
            -2.6051947
        ],
        [
            "The Berkeley",
            51.4555894,
            -2.6052585
        ],
        [
            "Noto",
            51.4646727,
            -2.6100476
        ],
        [
            "Convivio",
            51.4635377,
            -2.6073331
        ],
        [
            "Crying Wolf",
            51.4639537,
            -2.6083333
        ],
        [
            "Chums",
            51.467913,
            -2.6053169
        ],
        [
            "The Good Measure",
            51.4672439,
            -2.6071252
        ],
        [
            "Ironworks Supply Co",
            51.455504,
            -2.5937788
        ],
        [
            "Vittoria",
            51.4620967,
            -2.6085036
        ],
        [
            "The Woods",
            51.4553858,
            -2.6033058
        ],
        [
            "White Harte",
            51.4553192,
            -2.6031511
        ],
        [
            "The Mothers' Ruin",
            51.4538076,
            -2.5929164
        ],
        [
            "The Drawbridge",
            51.453385,
            -2.5984789
        ],
        [
            "Harveys Cellars",
            51.4531103,
            -2.5998505
        ],
        [
            "Smoke & Mirrors",
            51.4528307,
            -2.5988478
        ],
        [
            "The White Lion",
            51.4552118,
            -2.5957287
        ],
        [
            "omg bar",
            51.4534751,
            -2.6007437
        ],
        [
            "The Lost & Found",
            51.4569781,
            -2.6086941
        ],
        [
            "Sportsmans",
            51.4555564,
            -2.5973149
        ],
        [
            "Brace & Browns",
            51.4616075,
            -2.6082064
        ],
        [
            "Quinton House",
            51.457075,
            -2.6093414
        ],
        [
            "Gainsborough House",
            51.4609537,
            -2.5987573
        ],
        [
            "Under the Stars",
            51.4519841,
            -2.5975625
        ],
        [
            "mbargo",
            51.4566183,
            -2.6076765
        ],
        [
            "Kongs",
            51.4517047,
            -2.5942807
        ],
        [
            "Lime Kiln",
            51.4525563,
            -2.6036041
        ],
        [
            "Cosy Club",
            51.45433,
            -2.5950544
        ],
        [
            "BrewDog",
            51.453601,
            -2.5925843
        ],
        [
            "No. 1 Harbourside",
            51.4519703,
            -2.5979633
        ],
        [
            "The Botanist",
            51.4557986,
            -2.6059341
        ],
        [
            "Toto's Winebar",
            51.4523819,
            -2.5915187
        ],
        [
            "Robin Hood",
            51.4586081,
            -2.5994858
        ],
        [
            "Strawberry Thief",
            51.4554392,
            -2.5949357
        ],
        [
            "The Stable",
            51.4514245,
            -2.5983988
        ],
        [
            "bSb",
            51.4506717,
            -2.5982425
        ],
        [
            "Revolution",
            51.4536084,
            -2.5937999
        ],
        [
            "Brozen Bar",
            51.4537347,
            -2.5947412
        ],
        [
            "Cosies",
            51.4608601,
            -2.5863138
        ],
        [
            "Mickey Zoggs",
            51.4605398,
            -2.5871066
        ],
        [
            "Graze Bar & Chophouse",
            51.4512058,
            -2.5958711
        ],
        [
            "Beerd",
            51.4544104,
            -2.5986914
        ],
        [
            "Seamus O'Donnell's",
            51.4537641,
            -2.5931458
        ],
        [
            "Pampam",
            51.4578471,
            -2.6081619
        ],
        [
            "The Bank",
            51.4561906,
            -2.5940167
        ],
        [
            "7T2",
            51.4553067,
            -2.6031763
        ],
        [
            "The Doghouse",
            51.4544788,
            -2.5958866
        ],
        [
            "The Colston",
            51.4539374,
            -2.5964563
        ],
        [
            "Switch Bar",
            51.4539803,
            -2.5930364
        ],
        [
            "Hyde & Co.",
            51.4558333,
            -2.606933
        ],
        [
            "Her Majesty's Secret Service",
            51.4645228,
            -2.6103836
        ],
        [
            "The Kensington Arms",
            51.4672917,
            -2.6031109
        ],
        [
            "Antix",
            51.4543884,
            -2.6022376
        ],
        [
            "Zed Alley",
            51.4556056,
            -2.5972366
        ],
        [
            "jazz",
            51.4581429,
            -2.5837434
        ],
        [
            "Shebeen",
            51.4644748,
            -2.6118349
        ],
        [
            "The Hare on the Hill",
            51.4636448,
            -2.5918805
        ],
        [
            "The Gold Bar",
            51.4548319,
            -2.5935709
        ],
        [
            "Bar + Block",
            51.4519009,
            -2.5927399
        ]
    ],
    "selected": null
}

const SocketProvider = ({ wsUrl, children }) => {
    const [socket, setSocket] = useState()
    const [, dispatch] = useReducerContext()

    //setup socket
    useEffect(() => {
        const s = new WebSocket(wsUrl)
        setSocket(s)

        s.onopen = (event) => {
            dispatch({ type: 'connected' })

            const heartbeat = () => {
                if (!s) return
                if (s.readyState !== 1) return
                s.send("heartbeat")
                setTimeout(heartbeat, 500)
            }
    
            heartbeat()

            // setTimeout(() => {
            //     console.log("sending payload")
            //     dispatch({ type: 6, payload: payload2 })
            // }, 2000)
        }

        s.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log(data)

            if (data.message !== '') {
                if (data.cmd === 6) {
                    dispatch({ type: data.cmd, payload: JSON.parse(data.message) })
                } else {
                    dispatch({ type: data.cmd, payload: data.message })

                }
            }

        }

    }, [wsUrl, dispatch])

    if (!socket) return null;

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider