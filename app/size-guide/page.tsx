import Header from '@/components/header'
import Footer from '@/components/footer'

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Size Guide</h1>
          <div className="bg-card p-6 rounded-lg border">
            <p className="text-muted-foreground mb-6">
              Find the perfect fit for your sports gear with our comprehensive size guide.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Jerseys</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left">Size</th>
                        <th className="border border-border p-2 text-left">Chest (inches)</th>
                        <th className="border border-border p-2 text-left">Length (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-border p-2">S</td><td className="border border-border p-2">34-36</td><td className="border border-border p-2">27</td></tr>
                      <tr><td className="border border-border p-2">M</td><td className="border border-border p-2">38-40</td><td className="border border-border p-2">28</td></tr>
                      <tr><td className="border border-border p-2">L</td><td className="border border-border p-2">42-44</td><td className="border border-border p-2">29</td></tr>
                      <tr><td className="border border-border p-2">XL</td><td className="border border-border p-2">46-48</td><td className="border border-border p-2">30</td></tr>
                      <tr><td className="border border-border p-2">2XL</td><td className="border border-border p-2">50-52</td><td className="border border-border p-2">31</td></tr>
                      <tr><td className="border border-border p-2">3XL</td><td className="border border-border p-2">54-56</td><td className="border border-border p-2">32</td></tr>
                      <tr><td className="border border-border p-2">4XL</td><td className="border border-border p-2">58-60</td><td className="border border-border p-2">33</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Sneakers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left">Size</th>
                        <th className="border border-border p-2 text-left">US</th>
                        <th className="border border-border p-2 text-left">UK</th>
                        <th className="border border-border p-2 text-left">EU</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-border p-2">25</td><td className="border border-border p-2">7</td><td className="border border-border p-2">6</td><td className="border border-border p-2">40</td></tr>
                      <tr><td className="border border-border p-2">26</td><td className="border border-border p-2">8</td><td className="border border-border p-2">7</td><td className="border border-border p-2">41</td></tr>
                      <tr><td className="border border-border p-2">27</td><td className="border border-border p-2">9</td><td className="border border-border p-2">8</td><td className="border border-border p-2">42</td></tr>
                      <tr><td className="border border-border p-2">28</td><td className="border border-border p-2">10</td><td className="border border-border p-2">9</td><td className="border border-border p-2">43</td></tr>
                      <tr><td className="border border-border p-2">29</td><td className="border border-border p-2">11</td><td className="border border-border p-2">10</td><td className="border border-border p-2">44</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder size guide. You can customize the measurements and add more detailed sizing information here later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
