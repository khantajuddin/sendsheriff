import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Checkbox } from "@/components/ui/checkbox"
  import { ReloadIcon, InfoCircledIcon } from "@radix-ui/react-icons"
import { CHECK_LIST } from "./EmailForm"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

  
  export function TableResults(props: { results: any }) {
    const {results} = props
    return (
      <Table>
        <TableCaption>Checks on the emailer</TableCaption>
        <TableHeader>
          <TableRow>
          <TableHead className="w-[100px]">Sr. No</TableHead>
            <TableHead>Particular</TableHead>
            <TableHead  className="w-[100px] text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(results).map((el, index) => (
            <TableRow key={el[0]}>
              <TableCell className="font-medium">{index+1}</TableCell>
              <TableCell className="font-medium">
                {el[0]}
                <Popover>
                 <PopoverTrigger asChild>
                   <InfoCircledIcon className="inline ml-4" />
                 </PopoverTrigger>
                 <PopoverContent className="w-80 text-xs">
                    How it's been checked
                 </PopoverContent>
               </Popover>
                {el[0] === CHECK_LIST.responsive && el[1] === true ? 
                   <div className="flex gap-2 text-xs text-blue-600 mt-1">
                    <a href={"/screenshot_375.png"} target="_blank">Mobile</a> 
                   <a href={"/screenshot_768.png"} target="_blank">Tablet</a>
                   <a href={"/screenshot_1024.png"} target="_blank">Desktop</a></div>
                 : null }
                 
                </TableCell>
              <TableCell className="text-center">
                {el[1] === "loading" ? 
                  <ReloadIcon className="h-4 w-4 animate-spin inline" /> : 
                  <Checkbox id="terms" checked={el[1]} disabled />
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  export default TableResults
  