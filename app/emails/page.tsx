function createMarkup() {
    return {__html: '<div><div><input type="text"/></div></div>'};
  }

export default function MyComponent() {
    return <div dangerouslySetInnerHTML={createMarkup()} />;
  }