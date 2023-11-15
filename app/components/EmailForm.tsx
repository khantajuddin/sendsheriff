"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import QrScanner from "qr-scanner"
import { isUrlShortened } from "../helpers/urlHelpers"
export const CHECK_LIST = {
  subjectLine: "Is Subject Line filled",
  emojiCount: "No more than 1 emoji is used in Subject line",
  preHeader: "Is pre header line filled?",
  headerImageQuality: "Is header image quality good?",
  responsive: "Are images looking proper in Mobile View",
  qrCode: "Email Does not has QR code",
  shortendLink: "Email does not have shorten link",
  headerImageLogos: "No other brand logos in header image",
  headerImageCTA: "Component images should not have a visual like a button",
  bodyImages: "Are Body images size equal",
  componentsSpacing: "Components should have proper spacing",
}

const FormSchema = z.object({
  emailerLink: z
    .string()
    .min(10, {
      message: "Emailer must be at least 10 characters.",
    }),
  subjectLine: z.string(),
  preHeader: z.string(),
  headerImage: z.string(),
  bodyImages: z.string()
})

export default function EmailForm(props: { setResults: any, setPreview: any }) {
  const { setResults, setPreview } = props;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      emailerLink: "https://mcl7szjl9dv8320msl9htt67zx54.pub.sfmc-content.com/5zjha12wx0b?qs=c9c816fb0832a47d389059c2b971349331383411677d78d15d4b68d6eea1774c9c1b607516451ffe450519f1ac2e7b5c2997240fe5ff1b1d642bf0e2263ce888860dc56bb7f7040af5faa8a6c7a0b37214af307474c324f62e4307552cc251059f285f3f00fe981ee798a92549182e3a44da808cda9286658d11e8943f0f3590c3e9402a4637b5d0dbfad586f7f8fb8ce726ce158073364bb4db1e139cbc45e4bc85a4b95cf65593ff29dac59b8ddf6171fc170fd5edf368bd69ed9e85dad7ef4e131322be412e5b917195605c8ac4280bae4a04120bd1badc3e251c79f6adf5eb758b9559d0747136a4b25d28a1c7a367bc4cf05674ce85",
      subjectLine: "Hurry! Philips Salebration Steal Deal is ending! Hello  💁👌🎍😍 😊🌍🚀",
      preHeader: "Philips Steal Deal Salebration is here with the best of Philips products and exciting offers!",
      headerImage: "https://image.eu.ph.mc.philips.com/lib/fe3a117075640474711671/m/1/57412437-417f-4067-b7a5-db2253b0edcc.jpg",
      bodyImages: 
      `https://images.philips.com/is/image/philipsconsumer/9653dcfbf39245bc81d0ae7b00d8e8e0?hei=400&wid=400
      https://images.philips.com/is/image/philipsconsumer/9653dcfbf39245bc81d0ae7b00d8e8e0?hei=400&wid=400`
    },
  })

  const checkHeight = async (urls: string[]) => {
    const heights: Number[] = []
    for (const url of urls) {
      try {
        const response = await fetch("/api/imageheight", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.imageURI) {
          heights.push(data.imageURI)
        }

      } catch (error) {
        console.error("Error:", error);
      }
    }
    return heights.every((e: Number) => e === heights[0]);
  };

  async function countEmojis(str: string) {
    // Define a regular expression to match Unicode characters in the emoji range
    const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2600-\u27BF]/g;

    // Use the regular expression to find all matches in the string
    const emojiMatches = str.match(emojiRegex);

    // Return the number of emoji matches
    return emojiMatches ? emojiMatches.length : 0;
  }

  const checkQrCode = async (urls: string[]) => {
    for (const url of urls) {
      try {
        const response = await fetch("/api/imageurltouri", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const result = await QrScanner.scanImage(data.imageURI);

        if (result) {
          return true;
        }

        console.log("POST request successful. Response:", data);
        // Handle the response data as needed
      } catch (error) {
        console.error("Error:", error);
      }
    }

    // If none of the URLs resulted in a successful QR code scan
    return false;
  };

  const checkImageQuality = async (url: string) => {

    try {
      const response = await fetch("/api/rekognition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("POST request successful. Response:", data);
      return data.response.ImageProperties.Quality.Sharpness > 10;

    } catch (error) {
      console.error("Error:", error);
    }
    return false;
  };

  const checkOverLap = async (url: string) => {

    try {
      const response = await fetch("/api/checkoverlap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("overlap", data);
      if(data.hasNagativeMargin || data.hasOverlapping){
        return false
      }else{
        return true
      }

    } catch (error) {
      console.error("Error:", error);
    }
    return false;
  };

  const checkResponsiveNess = async (url: string) => {

    try {
      const response = await fetch("/api/checkresponsiveness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("POST request successful. Response:", data);
      return data;

    } catch (error) {
      console.error("Error:", error);
    }
    return false;
  };

  const checkIfHeaderHasOtherLogos = async (url: string) => {
    try {
      const response = await fetch("/api/checkimage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, question: 'does this image has logos other than "philips"?' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("POST request successful. Response:", data);
      if(data.response.toLowerCase() === "yes"){
        return true
      }else{
        return false
      }
      

    } catch (error) {
      console.error("Error:", error);
    }
    return false;
  };

  const checkIfHeaderHasCtaAsBanner = async (url: string) => {
    try {
      const response = await fetch("/api/checkimage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, question: 'does this image has cta button?' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("POST request successful. Response:", data);
      if(data.response.toLowerCase() === "yes"){
        return true
      }else{
        return false;
      }
     

    } catch (error) {
      console.error("Error:", error);
    }
    return false;
  };

  const downloadEmail = async (url: string) => {
    try {
      const response = await fetch("/api/downloadurl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("POST request successful. Response:", data);
      return data;

    } catch (error) {
      console.error("Error:", error);
    }
    return false;
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {

    setPreview((_:any) => "loading")
    const getPreviewUrl = await downloadEmail(data.emailerLink)
    setPreview((_:any) => getPreviewUrl.url)
    const loadingCheckList = Object.fromEntries(
      Object.values(CHECK_LIST).map((key) => [key, "loading"])
    );
    setResults((_: any) => loadingCheckList)


    setResults((prev: any) => ({ ...prev, [CHECK_LIST.subjectLine]: data.subjectLine.trim().length > 0 }))
    setResults((prev: any) => ({ ...prev, [CHECK_LIST.preHeader]: data.preHeader.trim().length > 0 }))

    const isImagesEqual = await checkHeight(data.bodyImages.split('\n').map(e=>e.trim()))
    setResults((prev: any) => ({ ...prev, [CHECK_LIST.bodyImages]: isImagesEqual }))


    const emojiCount = await countEmojis(data.subjectLine)
    setResults((prev: any) => ({ ...prev, [CHECK_LIST.emojiCount]: emojiCount <= 1 }))

    const headerImageQuality = await checkImageQuality(data.headerImage)
    setResults((prev: any) => ({ ...prev, [CHECK_LIST.headerImageQuality]: headerImageQuality }))

    const isResponsive = await checkResponsiveNess(data.emailerLink);
    console.log(isResponsive)
    setResults((prev: any) => ({ ...prev, [CHECK_LIST.responsive]: isResponsive.isResponsive }))
    
    const hasShortenedUrl = await isUrlShortened(isResponsive.links)
    setResults((prev: any) => ({ ...prev, [CHECK_LIST.shortendLink]: !hasShortenedUrl }))

      try{
        const result = await QrScanner.scanImage(isResponsive.screenshots[2], { returnDetailedScanResult: true });
        console.log(result)
        if (result) {
          setResults((prev: any) => ({ ...prev, [CHECK_LIST.qrCode]: false }))
        }else{
          setResults((prev: any) => ({ ...prev, [CHECK_LIST.qrCode]: true }))
        }
      }catch(e){
        setResults((prev: any) => ({ ...prev, [CHECK_LIST.qrCode]: true }))
        console.log(e)
      }
    

    const hasCtaButton = await checkIfHeaderHasCtaAsBanner(data.headerImage)
    setResults((prev: any) => ({ ...prev, [CHECK_LIST.headerImageCTA]: hasCtaButton }))
    
    const headerHasOtherLogos = await checkIfHeaderHasOtherLogos(data.headerImage);
    setResults((prev: any) => ({ ...prev, [CHECK_LIST.headerImageLogos]: !headerHasOtherLogos }))
  

    const checkOverlap = await checkOverLap(data.emailerLink)
    setResults((prev: any) => ({ ...prev, [CHECK_LIST.componentsSpacing]: checkOverlap }))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
          <FormField
            control={form.control}
            name="emailerLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email URL</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    rows={6}
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        <FormField
          control={form.control}
          name="subjectLine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Line</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter Subject line to check."
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField
          control={form.control}
          name="preHeader"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pre Header Line</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter Preheader line to"
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField
          control={form.control}
          name="headerImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Header Image Url</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

<FormField
            control={form.control}
            name="bodyImages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Images</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="list down all the body images each line"
                    rows={6}
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <Button type="submit">Validate Emailer</Button>
      </form>
    </Form>
  )
}
