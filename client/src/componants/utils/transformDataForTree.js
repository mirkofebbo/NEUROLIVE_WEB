/**
 * Transforms the provided data into a hierarchical format for D3's tree layout.
 * 
 * @param {Object} participantData - The selected participant data.
 * @param {Object} allSolos - All solos data.
 * @param {Object} allSongs - All songs data.
 * @returns {Object} Hierarchical data suitable for a D3 tree.
 */
function transformDataForTree(participantData, allSolos, allSongs) {
    // Starting with the selected participant as the root
    const treeData = {
        name: participantData.id,
        children: []
    };

    // Iterate over solos to find those witnessed by the participant
    Object.values(allSolos).forEach(solo => {
        const soloStartTime = new Date('1970/01/01 ' + solo.start).getTime();
        const soloStopTime = new Date('1970/01/01 ' + solo.stop).getTime();
        const participantInTime = new Date('1970/01/01 ' + participantData.in).getTime();
        const participantOutTime = new Date('1970/01/01 ' + participantData.out).getTime();

        // Check if the participant witnessed this solo
        if (soloStartTime >= participantInTime && soloStopTime <= participantOutTime) {
            const soloNode = {
                name: solo.id,
                children: []
            };

            // Iterate over songs to find those related to this solo
            Object.values(allSongs).forEach(song => {
                const songStartTime = new Date('1970/01/01 ' + song.start).getTime();
                const songStopTime = new Date('1970/01/01 ' + song.stop).getTime();

                // Check if the song is related to the solo
                if (songStartTime >= soloStartTime && songStopTime <= soloStopTime) {
                    soloNode.children.push({
                        name: `${song.name} by ${song.artist}`
                    });
                }
            });

            treeData.children.push(soloNode);
        }
    });

    return treeData;
}
