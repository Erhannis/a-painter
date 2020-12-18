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
  
  let text;
  QuickUI.loadUi(({UI}) =>
    UI.FoldLayout({degrees:25,diameter:15},
      UI.PageLayout({side:"bottom",autodistribute:true,gridparams:{cols:4,rows:4}},
        UI.UiButton({text:"color",oncontrollerdown:(function(){this.materials.normal.color = '#CC88AA';}),size:[3,3]}),
        UI.UiButton({text:"visible",oncontrollerdown:(function(){this.setAttribute('visible', false);}),size:[1,2]}),
        text = UI.UiText({text:"Blah",textcolor:"#55FF55"}),
        UI.UiButton({text:"text",oncontrollerdown:(function(){
          text.setAttribute("value",`${Math.random()}`);
          text.setAttribute("color","#667711");
        })}),
        UI.UiButton({text:"color",oncontrollerdown:(function(){this.materials.normal.color = '#AACC88';}),size:[2,2]}),
        UI.UiButton({text:"color",oncontrollerdown:(function(){this.materials.normal.color = '#88AACC';}),size:[2,2]})
      ),
      UI.UiText({text:"Middle\ntext\nhere",textcolor:"#440000"}),
      UI.TabsLayout({side:"top",labels:["John","Sally","Alice","Sam"]},
        UI.PageLayout({autodistribute:true,gridparams:{cols:4,rows:4}},
          ...([...Array(16).keys()].map(i => UI.UiButton({size:[2,2],text:`${i+1}`})))
        ),
        UI.PageLayout({autodistribute:false,gridparams:{cols:4,rows:4}},
          ...([...Array(16).keys()].map(i => UI.UiButton({size:[rInt(3)+1,rInt(3)+1],text:`${i+1}`})))
        ),
        UI.PageLayout({autodistribute:true,gridparams:{cols:4,rows:4}},
          ...([...Array(16).keys()].map(i => UI.UiButton({size:[rInt(3)+1,rInt(3)+1],text:`${i+1}`})))
        ),
        UI.UiTransform({scale:[0.2,0.2,0.2]},
          UI.GridLayout({cols:10},
            ...Array.from({length: 40}, x => UI.UiButton({size:[rInt(3)+1,rInt(3)+1]}))
            //...Array.from({length: 100}, x => UI.UiButton({size:[Math.random()*3,Math.random()*3]})) // Non-integer sizes are kinda buggy
          )
        )
      )
    )
  );
}