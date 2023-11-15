const EmailViewer = (props: { preview: any; }) => {
    const {preview} = props;
    if(preview === "loading"){
        return <div>Preview is getting generated...</div>
    }
    return <iframe className="w-full h-[400px]" src={preview}></iframe>
}
export default EmailViewer;