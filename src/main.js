// import {createGitgraph} from '@gitgraph/js';

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
(function() {
    // Get the graph container HTML element.
    const graphContainer = document.getElementById("graph-container");

    // var withoutHash = templateExtend(TemplateName.Metro, {
    //   commit: {
    //     message: {
    //       displayHash: false,
    //     },
    //   },
    // });

    const colors = {
      main: '#FFCB5D',
      quiz1exp1: '#CB5DFF',
      quiz1exp2: '#77A3FF',
      quiz2exp1: '#FF7A5D'
    };

    const getCommitOptions = (color = 'white') => ({
      style: {
        message: {
          displayAuthor: false,
          displayHash: false,
          color
        },
        dot: {
          size: 6,
          color
        }
      } 
    });

    const getBranchOptions = (color = 'white') => ({
      style: {  
        lineWidth: 2,
        label: {
          bgColor: color,
          color: 'black',
          strokeColor: color,
          borderRadius: 3
        },
        color
      }
    });

    // Instantiate the graph.
    // const gitgraph = createGitgraph(graphContainer, {
    //   orientation: "vertical-reverse"
    // });
    const gitgraph = GitgraphJS.createGitgraph(graphContainer, {
      orientation: "vertical-reverse",
      branchLabelOnEveryCommit: false
    });

    // Simulate git commands with Gitgraph API.
    const main = gitgraph.branch({ name: "main", ...getBranchOptions(colors.main) });
    main.commit({ subject: "(00:00) Tutorial starts", ...getCommitOptions(colors.main) });
    main.commit({ subject: "(00:50) Pause", ...getCommitOptions(colors.main) });
    main.commit({ subject: "(01:20) Quiz 1", ...getCommitOptions(colors.main) });

    const quiz1exp1 = main.branch({ name: "quiz1/explanation1", ...getBranchOptions(colors.quiz1exp1) });
    const quiz1exp2 = main.branch({ name: "quiz1/explanation2", ...getBranchOptions(colors.quiz1exp2) });
    quiz1exp1.commit({ subject: "(00:00) Start of explanation 1", ...getCommitOptions(colors.quiz1exp1) });
    quiz1exp2.commit({ subject: "(00:00) Start of explanation 2", ...getCommitOptions(colors.quiz1exp2) });
    quiz1exp1.commit({ subject: "(00:50) End of explanation 1", ...getCommitOptions(colors.quiz1exp1) });
    quiz1exp2.commit({ subject: "(01:13) End of explanation 2", ...getCommitOptions(colors.quiz1exp2) });

    main.commit({ subject: "(02:30) Pause", ...getCommitOptions(colors.main) });
    main.commit({ subject: "(02:50) Quiz 2", ...getCommitOptions(colors.main) });

    const quiz2exp1 = main.branch({ name: "quiz2/explanation1", ...getBranchOptions(colors.quiz2exp1) });
    quiz2exp1.commit({ subject: "(00:00) Start of explanation", ...getCommitOptions(colors.quiz2exp1) });
    quiz2exp1.commit({ subject: "(01:18) End of explanation", ...getCommitOptions(colors.quiz2exp1) });

    main.commit({ subject: "(03:11) Tutorial ends", ...getCommitOptions(colors.main) });
})();
