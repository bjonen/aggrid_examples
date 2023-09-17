In this version we save user state in window and apply it depending on the dropdown to the column definitions on re-render.

Advantage: User sees only one rendering
Disadvantage: We get the warning
AG Grid: unable to use colDef.rowGroup, colDef.pivot as the RowGroupingModule is not registered. Check if you have registered the module:

    import { ModuleRegistry } from '@ag-grid-community/core';
    import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';

    ModuleRegistry.registerModules([ RowGroupingModule ]);

React-Redux-AG-Grid-State-Blog uses onDataReady to apply changes. Check if this works w/o warnings. Probably its ok to have this double drawing.
