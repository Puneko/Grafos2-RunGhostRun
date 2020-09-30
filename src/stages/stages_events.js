var stages_info = new Map().set('stage_1', {
	player_spawn_point: {
		x: 9 * 16,
		y: 42 * 16
	},

	pacman_spawn_point: {
		x: 0,
		y: 41 * 16
	},

	end_area: {
		start: {
			x: 77 * 16,
			y: 38 * 16
		},

		end: {
			x: 80 * 16,
			y: 43 * 16
		}
	},

	events: [
		{
			x: 21 * 16,
			y: 34 * 16,
			size: 16,
			affects: [
				{
					type: 'door',
					width: 16,
					height: 80,
					x: 20 * 16,
					y: 26 * 16,
					transition: {
						x: 20 * 16,
						y: 31 * 16
					}
				},

				{
					type: 'graph',
					node: 2,
					edge: 3,
					weight: Infinity
				}
			]
		},

		{
			x: 50 * 16,
			y: 41 * 16,
			size: 16,
			affects: [
				{
					type: 'door',
					width: 16,
					height: 7 * 16,
					x: 47 * 16,
					y: 29 * 16,
					transition: {
						x: 47 * 16,
						y: 36 * 16
					}
				},

				{
					type: 'graph',
					node: 5,
					edge: 6,
					weight: Infinity
				}
			]
		}
	],

	graph: [
		{
			index: 0,
			x: 1 * 16 + 8,
			y: 42 * 16 + 8,
			edge: [1]
		},

		{
			index: 1,
			x: 17 * 16 + 8,
			y: 42 * 16 + 8,
			edge: [2]
		},

		{
			index: 2,
			x: 17 * 16 + 8,
			y: 34 * 16 + 8,
			edge: [3, 12]
		},

		{
			index: 3,
			x: 31 * 16 + 8,
			y: 34 * 16 + 8,
			edge: [4]
		},

		{
			index: 4,
			x: 31 * 16 + 8,
			y: 41 * 16 + 8,
			edge: [5]
		},

		{
			index: 5,
			x: 38 * 16 + 8,
			y: 41 * 16 + 8,
			edge: [6, 14]
		},

		{
			index: 6,
			x: 51 * 16 + 8,
			y: 41 * 16 + 8,
			edge: [7]
		},

		{
			index: 7,
			x: 59 * 16 + 8,
			y: 41 * 16 + 8,
			edge: [8]
		},

		{
			index: 8,
			x: 59 * 16 + 8,
			y: 18 * 16 + 8,
			edge: [9]
		},

		{
			index: 9,
			x: 73 * 16 + 8,
			y: 18 * 16 + 8,
			edge: [10]
		},

		{
			index: 10,
			x: 73 * 16 + 8,
			y: 40 * 16 + 8,
			edge: [11]
		},

		{
			index: 11,
			x: 79 * 16 + 8,
			y: 40 * 16 + 8,
			edge: []
		},

		{
			index: 12,
			x: 17 * 16 + 8,
			y: 23 * 16 + 8,
			edge: [13]
		},

		{
			index: 13,
			x: 31 * 16 + 8,
			y: 23 * 16 + 8,
			edge: [3]
		},

		{
			index: 14,
			x: 38 * 16 + 8,
			y: 23 * 16 + 8,
			edge: [15]
		},

		{
			index: 15,
			x: 51 * 16 + 8,
			y: 23 * 16 + 8,
			edge: [6]
		},
	]
});