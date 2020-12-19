/**
 * Example UI setup script
 * Note that most (perhaps all, even) params can be omitted, and there are probably other params not shown here.  See AFrame-Quick-UI/components/quick-ui.js for details.
 * The layouts with page-selection buttons (PageLayout, TabsLayout) take a `side` param for where the buttons should go.
 * Note that having many elements (e.g., over 100) can impact performance - less when they're not visible, but still some.
 */
{
  let rInt = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  
  //let edges = 
  let text;
  QuickUI.loadUi(({UI}) =>
    UI.FoldLayout({degrees:25,diameter:25},
      UI.TabsLayout({side:"left",labels:Object.keys(SYMMETRIES.data)}, // Edges
        ...(Object.entries(SYMMETRIES.data).map(([kEdges, vEdges]) =>
          UI.TabsLayout({side:"left",labels:Object.keys(vEdges)}, // Faces
            ...(Object.entries(vEdges).map(([kFaces, vFaces]) => 
              UI.GridLayout({rows:6},
                ...(vFaces.map((symmetry) => UI.UiButton({text:symmetry.mapping})))
              )
            ))
          )
        ))
        // UI.TabsLayout({side:"left",labels:["X"]}, // Coin
        //   UI.UiButton("")
        // ),
      ),
      UI.UiEntity(),
      UI.UiEntity()
    )
  );
}