describe("Ext.grid.plugin.DragDrop", function() {
    var grid1,
        grid2;

    var Model = Ext.define(null, {
        extend: 'Ext.data.Model',
        fields: ['group', 'text']
    });

    function findCell(grid, rowIdx, cellIdx) {
        return grid.getView().getCellInclusive({
            row: rowIdx,
            column: cellIdx
        }, true);
    }

    function triggerCellMouseEvent(grid, type, rowIdx, cellIdx, button, x, y) {
        var target = findCell(grid || grid1, rowIdx, cellIdx);

        jasmine.fireMouseEvent(target, type, x, y, button);
    }

    function selectRow(grid, rowIdx) {
        var target = findCell(grid, rowIdx, 0);
        jasmine.fireMouseEvent(target, 'click', 0, 0, false, false, true, false);
        return target;
    }

    function dragAndDrop(fromEl, fromX, fromY, toEl, toX, toY) {
        var dragThresh = Ext.dd.DragDropManager.clickPixelThresh + 1;

        runs(function() {
            jasmine.fireMouseEvent(fromEl, 'mouseover', fromX, fromY);
            jasmine.fireMouseEvent(fromEl, 'mousedown', fromX, fromY);
        });

        // Longpress starts drag
        if (jasmine.supportsTouch) {
            waits(1000);
        }

        runs(function() {
            jasmine.fireMouseEvent(fromEl, 'mousemove', fromX + dragThresh, fromY);

            jasmine.fireMouseEvent(fromEl, 'mouseout', toX, toY);
            jasmine.fireMouseEvent(fromEl, 'mouseleave', toX, toY);
            jasmine.fireMouseEvent(toEl, 'mouseenter', toX, toY);

            jasmine.fireMouseEvent(toEl, 'mouseover', toX, toY);
            jasmine.fireMouseEvent(toEl, 'mousemove', toX - dragThresh, toY);
            jasmine.fireMouseEvent(toEl, 'mousemove', toX, toY);
            jasmine.fireMouseEvent(toEl, 'mouseup', toX, toY);
            jasmine.fireMouseEvent(toEl, 'mouseout', fromX, fromY);

            // Mousemove outside triggers removal of overCls.
            // Touchmoves with no touchstart throw errors.
            if (!jasmine.supportsTouch) {
                jasmine.fireMouseEvent(fromEl, 'mousemove', fromX, fromY);
            }
        });
    }

    afterEach(function() {
        grid1 = grid2 = Ext.destroy(grid1, grid2);
    });

    function makeGrid(ddConfig, data, cfg) {
        return new Ext.grid.Panel(Ext.apply({
            renderTo: Ext.getBody(),
            height: 200,
            width: 200,
            multiSelect: true,
            features: [{
                ftype: 'grouping'
            }],
            viewConfig: {
                plugins: Ext.apply({
                    ptype: 'gridviewdragdrop'
                }, ddConfig)
            },
            store: {
                model: Model,
                groupField: 'group',
                data: data
            },
            columns: [{
                flex: 1,
                dataIndex: 'text'
            }]
        }, cfg));
    }

    describe("with checkbox selModel", function() {
        var cell, checkCell, checkbox, view, store;

        beforeEach(function() {
            grid1 = makeGrid({
                dragGroup: 'group1',
                dropGroup: 'group2'
            }, [{
                group: 'Group1',
                text: 'Item 1'
            }, {
                group: 'Group2',
                text: 'Item 2'
            }, {
                group: 'Group2',
                text: 'Item 3'
            }], {
                selModel: {
                    type: 'checkboxmodel'
                },
                columns: [{
                    text: 'Group',
                    dataIndex: 'group'
                }, {
                    text: 'Value',
                    dataIndex: 'text'
                }]
            });
            view = grid1.getView();
            store = grid1.getStore();

            cell = view.getCell(store.getAt(0), grid1.getColumnManager().getColumns()[1]);
            checkCell = grid1.getView().getCell(grid1.getStore().getAt(0), grid1.down('checkcolumn'));
            checkbox = checkCell.down('.x-grid-checkcolumn');
        });

        afterEach(function() {
            view = store = cell = checkCell = checkbox = null;
        });

        it("should be able to select the row by clicking on the checkbox", function() {
            grid1.getNavigationModel().setPosition(0, 0);
            jasmine.fireMouseEvent(checkbox, 'click');
            
            expect(grid1.getSelection().length).toBe(1);
        });

        it("should be able to select the row by clicking on the cell", function() {
            jasmine.fireMouseEvent(cell, 'click');

            expect(grid1.getSelection().length).toBe(1);
        });
    });

    describe("drag and drop between grids", function() {
        describe("drag and drop non-contiguous records", function() {
            it("should not cause a Maximum call stack size exceeded error", function() {
                var spy = jasmine.createSpy(),
                    dragEl, dropEl, box,
                    startX, startY, endX, endY, old;

                grid1 = makeGrid({
                    dragGroup: 'group1',
                    dropGroup: 'group2'
                }, [{
                    group: 'Group1',
                    text: 'Item 1'
                }, {
                    group: 'Group2',
                    text: 'Item 2'
                }, {
                    group: 'Group2',
                    text: 'Item 3'
                }]);
                grid2 = makeGrid({
                    dragGroup: 'group2',
                    dropGroup: 'group1',
                    dropZone: {
                        overClass: 'dropzone-over-class'
                    }
                });
                dragEl = selectRow(grid1, 0);
                box = Ext.get(dragEl).getBox();
                startX = box.left + 1;
                startY = box.top + 1;
                dropEl = grid2.getView().el;
                box = Ext.get(dropEl).getBox();
                endX = box.left + 20;
                endY = box.top + 20;

                // The class must be added, so call through
                spyOn(dropEl, 'addCls').andCallThrough();

                old = window.onerror;
                window.onerror = spy.andCallFake(function() {
                    if (old) {
                        old();
                    }
                });

                // Does a longpress on touch platforms, so next block must wait
                dragAndDrop(dragEl, startX, startY, dropEl, endX, endY);

                runs(function() {
                    expect(spy).not.toHaveBeenCalled();

                    window.onerror = old;

                    // overClass should have been added for mouse events
                    if (!jasmine.supportsTouch && !Ext.supports.PointerEvents) {
                        expect(grid2.getView().el.addCls.calls[0].args[0]).toBe('dropzone-over-class');

                        // But removed
                        expect(grid2.getView().el.hasCls('dropzone-over-class')).toBe(false);
                    }

                    // A drag/drop must have happened
                    expect(grid2.store.getCount()).toBe(1);
                });
            });
        });
    });
});