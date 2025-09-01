import Answers from "./Answers";

const QuesAns=({item,index})=>{
    return(
        <>
        <div key={index + Math.random()} className={item.type === "q" ? 'flex justify-end' : ''}>
                    {
                      item.type === "q" ? (
                        <li key={index + Math.random()} className='text-right border-8 p-1  dark:border-zinc-700 dark:bg-zinc-700 bg-red-100 border-red-100 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit'>
                          <Answers ans={item.text} totalresult={1} index={index} type={item.type} />
                        </li>
                      ) : (
                        item.text.map((ansItem, ansIndex) => (
                          <li key={ansIndex + Math.random()} className='text-left p-1'>
                            <Answers ans={ansItem} totalresult={item.text.length} index={ansIndex} type={item.type} />
                          </li>
                        ))
                      )
                    }
                  </div>
                 
        </>
    )
}
export default QuesAns;