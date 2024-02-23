import jsonData from '../../data/demo.json';

const transformToHierarchy = () => {
    console.log(jsonData["SUN"])
    // Extract participants, solos, and songs

    // const { participants, solo, songs } = data;

    // // Transform each participant into a hierarchical node
    // const participantsHierarchy = Object.entries(participants).map(([id, participant]) => {
    //     // Find solos and songs that fall within the participant's timeline
    //     const participantSolos = Object.values(solo).filter(s => 
    //         s.start >= participant.in && s.stop <= participant.out
    //     );
        
    //     const participantSongs = Object.values(songs).filter(song => 
    //         song.start >= participant.in && song.stop <= participant.out
    //     );

    //     // Combine solos and songs under this participant
    //     const children = [...participantSolos, ...participantSongs].map(item => ({
    //         ...item,
    //         children: [] // Placeholder for potential further nesting
    //     }));

    //     return {
    //         ...participant,
    //         id,
    //         children
    //     };
    // });

    // For simplicity, this example assumes a single participant is selected
    // You would need to adjust this to dynamically select a participant based on user interaction
    // return participantsHierarchy[0]; // Returning the first participant for demonstration
    return "Yes"
};
