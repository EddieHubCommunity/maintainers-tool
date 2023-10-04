export default function RepoForm() {
  return (
    <form action="/search">
      <div className="flex justify-center gap-2">
        <div className="flex flex-col w-[35ch]">
          <label htmlFor="org" className="pb-1">Repo Owner</label>
          <input name="org" id="org" list="org-list" type="text" pattern="[A-Za-z0-9_.\-]+"
            className="text-black invalid:border-pink-500 invalid:text-pink-600"
          />
          <datalist id="org-list">
            <option value="EddieHubCommunity"></option>
          </datalist>
        </div>
        <div className="flex flex-col w-[35ch]">
          <label htmlFor="repo" className="pb-1">Repo Name</label>
          <input name="repo" id="repo" list="repo-list" type="text" pattern="[A-Za-z0-9_.\-]+"
            className="text-black invalid:border-pink-500 invalid:text-pink-600"
          />
          <datalist id="repo-list">
            <option value="BioDrop"></option>
          </datalist>
        </div>
        <div className="flex flex-col w-[25ch]">
          <label htmlFor="user" className="pb-1">GitHub ID</label>
          <input name="user" id="user" type="text" pattern="[A-Za-z0-9_.\-]+"
            className="text-black invalid:border-pink-500 invalid:text-pink-600"
          />
        </div>
      </div>
      <button type="submit" className="p-2 mx-auto my-2 block outline outline-1 leading-none rounded">Submit</button>
    </form>
  );
}