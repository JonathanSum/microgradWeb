

const data = {
    nodes: [
        { id: 'Myriel', group: 'team1' },
        { id: 'Anne', group: 'team1' },
        { id: 'Gabriel', group: 'team1' },
        { id: 'Mel', group: 'team1' },
        { id: 'Yan', group: 'team2' },
        { id: 'Tom', group: 'team2' },
    ],
    links: [
        { source: 'Myriel', target: 'Anne', value: 1 },
        { source: 'Anne', target: 'Gabriel', value: 1 },
        { source: 'Mel', target: 'Myriel', value: 1 },
        { source: 'Mel', target: 'Myriel', value: 1 },

    ],
};
export default data;