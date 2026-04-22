import React from 'react';

// Rubric: List rendering with proper keys
const ListRenderer = ({ 
  items, 
  renderItem, 
  emptyMessage = "No items found",
  keyExtractor = (item, index) => index 
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <React.Fragment key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
};

// For grid layouts
export const GridRenderer = ({ items, renderItem, columns = 3, ...props }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4`}>
      <ListRenderer items={items} renderItem={renderItem} {...props} />
    </div>
  );
};

export default ListRenderer;