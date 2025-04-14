export default function Upgrade() {
    return (
    <>
    <div id="upgrade">
        <span><img src="/wallet.svg"></img>Bitcoin : 0.000021</span>
        <div>
            <h2>Mining</h2>
            <article>
                <button>Mine a Bitcoin</button>
                <p>Value : 0.000001</p>
            </article>
        </div>
        <div>
            <h2>Bot</h2>
            <span><i>Number of bot :</i>12</span>
            <span><i>Total value :</i>0.002</span>
            <span><i>Duration :</i>40 sec</span>
        </div>
        <div>
        <h2>Market</h2>
        <form>
            <select name="percentage" id="percentage">
                <option value="">0%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
            </select>
            <input type="text" placeholder="Enter your amount : "></input>
            <input type="submit" value="Validate"></input>
        </form>
        </div>
    </div>
    </>
    )
}